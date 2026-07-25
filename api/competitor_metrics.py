"""Competitor tracking: Yahoo stock, SEC quarterly EPS, optional news headlines, custom metrics."""

from __future__ import annotations

import json
import os
import uuid
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any, Literal

import httpx

import news_integration

_HERE = os.path.dirname(__file__)
CONFIG_PATH = os.path.join(_HERE, "competitor_config.json")

MetricType = Literal["stock", "earnings", "news_7d", "custom"]

DEFAULT_CONFIG: dict[str, Any] = {
    "companies": [
        {
            "id": "google",
            "name": "Google",
            "ticker": "GOOGL",
            "newsQuery": "Google Gemini AI workspace",
            "metricTypes": ["stock", "earnings", "news_7d"],
            "customMetrics": [],
        },
        {
            "id": "notion_ai",
            "name": "Notion AI",
            "ticker": "",
            "newsQuery": "Notion AI assistant",
            "metricTypes": ["news_7d"],
            "customMetrics": [{"id": "g2", "label": "G2 score (manual)", "value": "4.7", "unit": "/5"}],
        },
        {
            "id": "perplexity",
            "name": "Perplexity",
            "ticker": "",
            "newsQuery": "Perplexity AI enterprise",
            "metricTypes": ["news_7d"],
            "customMetrics": [],
        },
        {
            "id": "granola",
            "name": "Granola",
            "ticker": "",
            "newsQuery": "Granola AI meeting notes",
            "metricTypes": ["news_7d"],
            "customMetrics": [],
        },
        {
            "id": "dovetail",
            "name": "Dovetail",
            "ticker": "",
            "newsQuery": "Dovetail research AI UX",
            "metricTypes": ["news_7d"],
            "customMetrics": [],
        },
    ]
}

_YAHOO_UA = "Mozilla/5.0 (compatible; AtlasCompetitorTracker/1.0)"
_SEC_UA = "Atlas CMU Prototype contact@cmu.edu"
_TICKER_CIK_CACHE: dict[str, str] | None = None

# Public-market symbols used when a competitor has no ticker (private company). Editable via config `chartTicker`.
CHART_TICKER_HINTS_BY_ID: dict[str, str] = {
    "google": "GOOGL",
    "notion_ai": "MSFT",
    "perplexity": "META",
    "granola": "CRM",
    "dovetail": "ADBE",
}
CHART_TICKER_HINTS_BY_NAME: dict[str, str] = {
    "OpenAI": "MSFT",
    "Anthropic": "AMZN",
}


def market_ticker(company: dict[str, Any]) -> str:
    return (company.get("ticker") or company.get("chartTicker") or "").strip().upper()


def enrich_config(config: dict[str, Any]) -> dict[str, Any]:
    changed = False
    for company in config.get("companies", []):
        if market_ticker(company):
            continue
        hint = CHART_TICKER_HINTS_BY_ID.get(company.get("id") or "") or CHART_TICKER_HINTS_BY_NAME.get(
            company.get("name") or ""
        )
        if hint:
            company["chartTicker"] = hint
            changed = True
    if changed:
        save_config(config)
    return config


def load_config() -> dict[str, Any]:
    if os.path.isfile(CONFIG_PATH):
        with open(CONFIG_PATH) as f:
            config = json.load(f)
        return enrich_config(config)
    save_config(deepcopy(DEFAULT_CONFIG))
    return enrich_config(deepcopy(DEFAULT_CONFIG))


def save_config(config: dict[str, Any]) -> None:
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


def fetch_stock_series(ticker: str, range_: str = "1mo") -> dict[str, Any]:
    symbol = ticker.strip().upper()
    if not symbol:
        raise ValueError("Ticker required for stock metric")
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
    params = {"interval": "1d", "range": range_}
    with httpx.Client(timeout=20.0, follow_redirects=True) as client:
        resp = client.get(url, params=params, headers={"User-Agent": _YAHOO_UA})
        resp.raise_for_status()
        data = resp.json()
    result = (data.get("chart") or {}).get("result") or []
    if not result:
        raise RuntimeError(f"No market data for {symbol}")
    meta = result[0].get("meta") or {}
    timestamps = result[0].get("timestamp") or []
    closes = (result[0].get("indicators") or {}).get("quote", [{}])[0].get("close") or []
    points: list[dict[str, Any]] = []
    for ts, close in zip(timestamps, closes):
        if close is None:
            continue
        points.append({"t": ts, "close": round(float(close), 2)})
    if len(points) < 2:
        raise RuntimeError(f"Insufficient price history for {symbol}")
    latest = points[-1]["close"]
    prev = points[-2]["close"]
    change_pct = round(((latest - prev) / prev) * 100, 2) if prev else 0.0
    return {
        "ticker": symbol,
        "currency": meta.get("currency", "USD"),
        "price": latest,
        "changePct1d": change_pct,
        "series": points[-30:],
    }


def _ticker_to_cik(ticker: str) -> str:
    global _TICKER_CIK_CACHE
    symbol = ticker.strip().upper()
    if _TICKER_CIK_CACHE is None:
        with httpx.Client(timeout=30.0, follow_redirects=True) as client:
            resp = client.get(
                "https://www.sec.gov/files/company_tickers.json",
                headers={"User-Agent": _SEC_UA},
            )
            resp.raise_for_status()
            raw = resp.json()
        _TICKER_CIK_CACHE = {
            (v.get("ticker") or "").upper(): str(v["cik_str"]).zfill(10) for v in raw.values()
        }
    cik = _TICKER_CIK_CACHE.get(symbol)
    if not cik:
        raise RuntimeError(f"No SEC CIK for ticker {symbol}")
    return cik


def fetch_earnings_quarterly(ticker: str, calendar_year: int | None = None) -> dict[str, Any]:
    symbol = ticker.strip().upper()
    year = calendar_year or datetime.now(timezone.utc).year
    cik = _ticker_to_cik(symbol)
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    with httpx.Client(timeout=45.0, follow_redirects=True) as client:
        resp = client.get(url, headers={"User-Agent": _SEC_UA})
        resp.raise_for_status()
        facts = resp.json()
    gaap = (facts.get("facts") or {}).get("us-gaap") or {}
    eps_block = gaap.get("EarningsPerShareDiluted") or gaap.get("EarningsPerShareBasic")
    if not eps_block:
        raise RuntimeError(f"No EPS facts in SEC filings for {symbol}")
    units = eps_block.get("units") or {}
    series_raw = units.get("USD/shares") or units.get("USD") or next(iter(units.values()), [])
    by_frame: dict[str, dict[str, Any]] = {}
    for row in series_raw:
        frame = row.get("frame") or ""
        if not frame.startswith("CY") or "Q" not in frame:
            continue
        if row.get("form") not in ("10-Q", "10-K"):
            continue
        prev = by_frame.get(frame)
        if not prev or (row.get("filed") or "") >= (prev.get("filed") or ""):
            by_frame[frame] = row

    yoy_quarters: list[dict[str, Any]] = []
    for q in range(1, 5):
        cur_frame = f"CY{year}Q{q}"
        prior_frame = f"CY{year - 1}Q{q}"
        cur = by_frame.get(cur_frame)
        prior = by_frame.get(prior_frame)
        if not cur or not prior:
            continue
        cur_eps = round(float(cur["val"]), 2)
        prior_eps = round(float(prior["val"]), 2)
        yoy_pct = round(((cur_eps - prior_eps) / abs(prior_eps)) * 100, 1) if prior_eps else 0.0
        yoy_quarters.append(
            {
                "quarter": f"Q{q}",
                "year": year,
                "frame": cur_frame,
                "epsCurrent": cur_eps,
                "epsPriorYear": prior_eps,
                "yoyPct": yoy_pct,
            }
        )

    if not yoy_quarters:
        raise RuntimeError(f"No YoY EPS quarters for {symbol} in calendar year {year}")

    latest = yoy_quarters[-1]
    avg_yoy = round(sum(r["yoyPct"] for r in yoy_quarters) / len(yoy_quarters), 1)
    return {
        "ticker": symbol,
        "unit": "USD/share",
        "source": "sec_edgar",
        "calendarYear": year,
        "latestYoyPct": latest["yoyPct"],
        "avgYoyPctCurrentYear": avg_yoy,
        "latestQuarter": latest["quarter"],
        "yoyQuarters": yoy_quarters,
    }


def resolve_company(company: dict[str, Any], news_limit: int = 6) -> dict[str, Any]:
    types = company.get("metricTypes") or ["news_7d"]
    resolved: dict[str, Any] = {
        "id": company["id"],
        "name": company["name"],
        "ticker": company.get("ticker") or "",
        "chartTicker": company.get("chartTicker") or "",
        "marketTicker": market_ticker(company),
        "marketTickerIsProxy": bool(not (company.get("ticker") or "").strip() and market_ticker(company)),
        "newsQuery": company.get("newsQuery") or company["name"],
        "customMetrics": company.get("customMetrics") or [],
        "stock": None,
        "earnings": None,
        "news": None,
        "latestHeadline": None,
        "errors": [],
    }

    symbol = market_ticker(company)
    if symbol:
        try:
            resolved["stock"] = fetch_stock_series(symbol)
        except Exception as e:
            resolved["errors"].append(f"Stock ({symbol}): {e}")
        try:
            resolved["earnings"] = fetch_earnings_quarterly(symbol)
        except Exception as e:
            resolved["errors"].append(f"Earnings ({symbol}): {e}")

    if "news_7d" in types:
        query = f"{resolved['newsQuery']} when:7d"
        try:
            headlines = news_integration.fetch_headlines(query, "google", news_limit)
            resolved["news"] = {"count7d": len(headlines), "headlines": headlines[:4]}
            resolved["latestHeadline"] = headlines[0] if headlines else None
        except Exception as e:
            resolved["errors"].append(f"News: {e}")

    return resolved


def resolve_all(config: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    cfg = config or load_config()
    return [resolve_company(c) for c in cfg.get("companies", [])]


def add_company(config: dict[str, Any], name: str, ticker: str = "", news_query: str = "") -> dict[str, Any]:
    entry = {
        "id": str(uuid.uuid4())[:8],
        "name": name.strip(),
        "ticker": ticker.strip().upper(),
        "chartTicker": "",
        "newsQuery": (news_query or name).strip(),
        "metricTypes": (["stock", "earnings", "news_7d"] if ticker.strip() else ["news_7d"]),
        "customMetrics": [],
    }
    config.setdefault("companies", []).append(entry)
    save_config(config)
    return entry


def add_custom_metric(config: dict[str, Any], company_id: str, label: str, value: str, unit: str = "") -> dict[str, Any]:
    metric = {"id": str(uuid.uuid4())[:8], "label": label.strip(), "value": value.strip(), "unit": unit.strip()}
    for c in config.get("companies", []):
        if c["id"] == company_id:
            c.setdefault("customMetrics", []).append(metric)
            save_config(config)
            return metric
    raise KeyError(f"Company {company_id} not found")


def remove_company(config: dict[str, Any], company_id: str) -> None:
    config["companies"] = [c for c in config.get("companies", []) if c["id"] != company_id]
    save_config(config)


def update_config_companies(config: dict[str, Any]) -> None:
    save_config(config)
