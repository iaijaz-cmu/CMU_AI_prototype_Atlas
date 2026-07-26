"""Live G2 product ratings via G2's ai.g2.com product pages (public HTML)."""

from __future__ import annotations

import os
import re
import time
from typing import Any

import httpx

_G2_AI_BASE = "https://ai.g2.com/product"
_UA = "Mozilla/5.0 (compatible; AtlasCompetitorTracker/1.0; +CMU Atlas prototype)"
_CACHE: dict[str, tuple[float, dict[str, Any]]] = {}
_CACHE_TTL_SEC = 6 * 60 * 60

_DEFAULT_SLUG_BY_ID: dict[str, str] = {
    "google": "google-workspace",
    "notion_ai": "notion",
    "perplexity": "perplexity",
    "granola": "granola",
    "dovetail": "dovetail-research-pty-ltd-dovetail",
    "31d54845": "chatgpt",
}

_RATING_RE = re.compile(
    r'G2 Rating[\s\S]{0,1400}?aria-label="([0-9.]+) out of 5 stars"',
    re.IGNORECASE,
)
_RATING_FALLBACK_RE = re.compile(r'aria-label="([0-9.]+) out of 5 stars"')
_REVIEWS_RE = re.compile(r"([\d,]+)\s+reviews", re.IGNORECASE)


def default_g2_slug(company_id: str, name: str) -> str:
    if company_id in _DEFAULT_SLUG_BY_ID:
        return _DEFAULT_SLUG_BY_ID[company_id]
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or company_id


def company_g2_slug(company: dict[str, Any]) -> str:
    explicit = (company.get("g2Slug") or "").strip()
    if explicit:
        return explicit
    return default_g2_slug(company.get("id") or "", company.get("name") or "")


def _parse_ai_g2_html(html: str, slug: str) -> dict[str, Any] | None:
    m = _RATING_RE.search(html) or _RATING_FALLBACK_RE.search(html)
    if not m:
        return None
    score = float(m.group(1))
    if score <= 0 or score > 5:
        return None
    rev = _REVIEWS_RE.search(html)
    review_count = int(rev.group(1).replace(",", "")) if rev else None
    return {
        "score": round(score, 1),
        "maxScore": 5,
        "reviewCount": review_count,
        "url": f"https://www.g2.com/products/{slug}/reviews",
        "source": "g2_live",
        "live": True,
    }


def _fetch_ai_g2(slug: str) -> dict[str, Any] | None:
    url = f"{_G2_AI_BASE}/{slug}"
    with httpx.Client(follow_redirects=True, timeout=20.0, headers={"User-Agent": _UA}) as client:
        r = client.get(url)
    if r.status_code != 200 or len(r.text) < 5000:
        return None
    return _parse_ai_g2_html(r.text, slug)


def _fetch_g2_api(slug: str) -> dict[str, Any] | None:
    token = (os.environ.get("G2_API_TOKEN") or os.environ.get("G2_API_KEY") or "").strip()
    if not token:
        return None
    headers = {
        "Authorization": f"Token token={token}",
        "Accept": "application/vnd.api+json",
    }
    params = {"filter[slug]": slug, "page[size]": 1}
    try:
        with httpx.Client(timeout=20.0, headers=headers) as client:
            r = client.get("https://data.g2.com/api/v1/products", params=params)
        if r.status_code != 200:
            return None
        payload = r.json()
        rows = payload.get("data") or []
        if not rows:
            return None
        attrs = rows[0].get("attributes") or {}
        rating = attrs.get("star_rating") or attrs.get("avg_rating") or attrs.get("rating")
        if rating is None:
            return None
        score = round(float(rating), 1)
        review_count = attrs.get("review_count") or attrs.get("survey_responses_count")
        return {
            "score": score,
            "maxScore": 5,
            "reviewCount": int(review_count) if review_count is not None else None,
            "url": f"https://www.g2.com/products/{slug}/reviews",
            "source": "g2_api",
            "live": True,
        }
    except Exception:
        return None


def fetch_g2_rating(slug: str) -> dict[str, Any] | None:
    slug = slug.strip().strip("/")
    if not slug:
        return None

    now = time.time()
    cached = _CACHE.get(slug)
    if cached and now - cached[0] < _CACHE_TTL_SEC:
        return dict(cached[1])

    result = _fetch_ai_g2(slug) or _fetch_www_g2(slug) or _fetch_g2_api(slug)
    if result:
        _CACHE[slug] = (now, result)
    return result


def _fetch_www_g2(slug: str) -> dict[str, Any] | None:
    """Best-effort parse of www.g2.com (often blocked server-side; works when not captcha'd)."""
    url = f"https://www.g2.com/products/{slug}/reviews"
    try:
        with httpx.Client(follow_redirects=True, timeout=20.0, headers={"User-Agent": _UA}) as client:
            r = client.get(url)
    except Exception:
        return None
    if r.status_code != 200 or len(r.text) < 8000:
        return None
    compact = re.sub(r"\s+", "", r.text)
    m = re.search(r"(\d\.\d)outof5", compact, re.IGNORECASE)
    if not m:
        parsed = _parse_ai_g2_html(r.text, slug)
        return parsed
    score = round(float(m.group(1)), 1)
    if score <= 0 or score > 5:
        return None
    return {
        "score": score,
        "maxScore": 5,
        "reviewCount": None,
        "url": url,
        "source": "g2_live",
        "live": True,
    }


def resolve_g2_for_company(company: dict[str, Any]) -> dict[str, Any] | None:
    slug = company_g2_slug(company)
    alternates = company.get("g2SlugAlternates") or []
    seen: set[str] = set()
    for candidate in [slug, *alternates]:
        c = candidate.strip().strip("/")
        if not c or c in seen:
            continue
        seen.add(c)
        result = fetch_g2_rating(c)
        if result:
            return result
    return None
