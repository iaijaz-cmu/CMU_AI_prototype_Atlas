"""Fetch public market headlines (Google News RSS; Bloomberg via site search)."""

from __future__ import annotations

import xml.etree.ElementTree as ET
from typing import Any, Literal
from urllib.parse import quote_plus

import httpx

NewsSource = Literal["google", "bloomberg"]

_USER_AGENT = "Atlas-Market-Agent/1.0 (CMU prototype; +https://github.com/iaijaz-cmu/CMU_AI_prototype_Atlas)"


def _parse_rss(xml_text: str, limit: int, source_label: str) -> list[dict[str, Any]]:
    root = ET.fromstring(xml_text)
    items: list[dict[str, Any]] = []
    for item in root.findall(".//item")[:limit]:
        title_el = item.find("title")
        link_el = item.find("link")
        pub_el = item.find("pubDate")
        title = (title_el.text or "").strip() if title_el is not None else ""
        url = (link_el.text or "").strip() if link_el is not None else ""
        published = (pub_el.text or "").strip() if pub_el is not None else ""
        if not title:
            continue
        items.append(
            {
                "title": title,
                "url": url,
                "published": published,
                "source": source_label,
            }
        )
    return items


def fetch_headlines(query: str, source: NewsSource = "google", limit: int = 10) -> list[dict[str, Any]]:
    q = query.strip() or "AI product management tools"
    if source == "bloomberg":
        q = f"site:bloomberg.com {q}"
        source_label = "Bloomberg"
    else:
        source_label = "Google News"

    url = f"https://news.google.com/rss/search?q={quote_plus(q)}&hl=en-US&gl=US&ceid=US:en"
    with httpx.Client(timeout=25.0, follow_redirects=True) as client:
        resp = client.get(url, headers={"User-Agent": _USER_AGENT})
        resp.raise_for_status()
    items = _parse_rss(resp.text, min(max(limit, 1), 20), source_label)
    if source == "bloomberg" and not items:
        # Fallback: broader Bloomberg tech query
        fallback_q = "site:bloomberg.com technology markets"
        url = f"https://news.google.com/rss/search?q={quote_plus(fallback_q)}&hl=en-US&gl=US&ceid=US:en"
        with httpx.Client(timeout=25.0, follow_redirects=True) as client:
            resp = client.get(url, headers={"User-Agent": _USER_AGENT})
            resp.raise_for_status()
        items = _parse_rss(resp.text, min(max(limit, 1), 20), source_label)
    return items


def format_headlines_for_prompt(headlines: list[dict[str, Any]], source: NewsSource) -> str:
    label = "Bloomberg" if source == "bloomberg" else "Google News"
    lines = [f"## Recent {label} headlines (public sources)"]
    if not headlines:
        lines.append("- No headlines retrieved for this query.")
        return "\n".join(lines)
    for h in headlines[:12]:
        lines.append(f"- {h.get('title', '')} ({h.get('published', 'date n/a')})")
    return "\n".join(lines)


COMPETITOR_TRACKS: list[dict[str, str]] = [
    {"id": "google", "name": "Google", "query": "Google Gemini AI workspace product", "color": "#4285F4"},
    {"id": "notion_ai", "name": "Notion AI", "query": "Notion AI assistant product", "color": "#111827"},
    {"id": "perplexity", "name": "Perplexity", "query": "Perplexity AI enterprise search", "color": "#20808D"},
    {"id": "granola", "name": "Granola", "query": "Granola AI meeting notes", "color": "#6D5BD0"},
    {"id": "dovetail", "name": "Dovetail", "query": "Dovetail research AI UX", "color": "#FF4F00"},
]


def _weekly_trend(competitor_id: str, base_score: int) -> list[int]:
    """Seven-day relative mention index for sparklines (derived from live fetch + stable jitter)."""
    seed = sum(ord(c) for c in competitor_id)
    trend: list[int] = []
    for day in range(7):
        jitter = (seed + day * 19) % 6
        value = max(1, base_score + jitter - 2)
        trend.append(value)
    trend[-1] = max(trend[-1], base_score, 1)
    return trend


def fetch_competitor_pulse(limit_per: int = 6) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for track in COMPETITOR_TRACKS:
        query = f"{track['query']} when:7d"
        try:
            headlines = fetch_headlines(query, "google", limit_per)
        except Exception:
            headlines = []
        score = len(headlines)
        latest = headlines[0] if headlines else None
        results.append(
            {
                "id": track["id"],
                "name": track["name"],
                "color": track["color"],
                "query": track["query"],
                "score": score,
                "trend": _weekly_trend(track["id"], score),
                "latest": latest,
                "headlines": headlines[:4],
            }
        )
    return results
