"""
Atlas API — thin FastAPI wrapper around atlas_core.generate_response so the
React frontend (../../app) can call the same retrieval + GPT-4o-mini pipeline
that sprint2/atlas_app_v0.3.py exposes as a Streamlit UI.

Run:
    cd backend/api
    cp .env.example .env   # then fill in OPENAI_API_KEY
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8787
"""

from __future__ import annotations

import os
from typing import Literal, Optional

from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import atlas_core
import competitor_metrics
import news_integration
import slack_integration

load_dotenv()

app = FastAPI(title="Atlas API")

_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
allowed_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

AgentId = Literal["product", "engineering", "market", "sales"]


class GenerateRequest(BaseModel):
    message: str
    agent: Optional[AgentId] = None
    scope: Optional[str] = None
    history: list[dict[str, str]] = []


class Citation(BaseModel):
    id: str
    source: str
    snippet: Optional[str] = None


class Confidence(BaseModel):
    level: Literal["High", "Medium", "Low"]
    reason: str


class GenerateResponse(BaseModel):
    content: str
    body: str
    title: Optional[str] = None
    confidence: Optional[Confidence] = None
    uncertaintyFlags: Optional[str] = None
    citations: list[Citation]
    themes: list[str]


def _openai_key() -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured on the server. Add it to backend/api/.env and restart the API.",
        )
    return api_key


def _build_generate_response(req: GenerateRequest) -> GenerateResponse:
    user_input = req.message.strip()
    if req.scope:
        user_input = f"The user scoped this question to the {req.scope} integration (use that lens when relevant; still ground claims in retrieved context).\n\n{user_input}"

    if competitor_metrics.should_attach_live_metrics(req.message, req.agent):
        try:
            live_block = competitor_metrics.format_live_metrics_block(req.message, req.agent)
            user_input = f"{live_block}\n{user_input}"
        except Exception:
            pass

    try:
        content, ctx = atlas_core.generate_response(
            user_input,
            _openai_key(),
            req.history or None,
            req.agent,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Generation failed: {e}") from e

    return GenerateResponse(
        content=content,
        body=atlas_core.strip_meta_sections(content),
        title=atlas_core.extract_title(content),
        confidence=atlas_core.extract_confidence(content),
        uncertaintyFlags=atlas_core.extract_uncertainty_flags(content),
        citations=atlas_core.extract_citations(content, ctx),
        themes=atlas_core.detect_themes(req.message),
    )


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "model": atlas_core.MODEL,
        "promptVersion": atlas_core.PROMPT_VERSION,
        "slackConfigured": slack_integration.is_configured(),
    }


@app.post("/api/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message must not be empty")
    return _build_generate_response(req)


class SlackRespondRequest(BaseModel):
    question: str
    postToSlack: bool = False
    history: list[dict[str, str]] = []


def _slack_thread_context() -> tuple[str | None, str | None, list]:
    if slack_integration.is_configured():
        cid = slack_integration.resolve_channel_id()
        info = slack_integration.channel_info(cid)
        messages = slack_integration.fetch_messages(cid, limit=15)
        return cid, info.get("name"), messages
    demo = slack_integration.demo_channel()
    return None, demo.get("name"), slack_integration.demo_messages(15)


@app.get("/api/slack/status")
def slack_status():
    if not slack_integration.is_configured():
        return {
            "configured": False,
            "demoMode": True,
            "channel": slack_integration.demo_channel(),
            "eventsReady": bool(slack_integration.signing_secret()),
        }
    try:
        cid = slack_integration.resolve_channel_id()
        info = slack_integration.channel_info(cid)
        return {
            "configured": True,
            "demoMode": False,
            "channel": {"id": info.get("id"), "name": info.get("name"), "isMember": info.get("is_member")},
            "eventsReady": bool(slack_integration.signing_secret()),
        }
    except Exception as e:
        return {"configured": True, "channel": None, "error": str(e), "eventsReady": bool(slack_integration.signing_secret())}


@app.get("/api/slack/messages")
def slack_messages(limit: int = 20):
    if not slack_integration.is_configured():
        return {"channel": slack_integration.demo_channel(), "messages": slack_integration.demo_messages(limit), "demoMode": True}
    try:
        cid = slack_integration.resolve_channel_id()
        info = slack_integration.channel_info(cid)
        messages = slack_integration.fetch_messages(cid, limit=limit)
        return {"channel": info, "messages": messages, "demoMode": False}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.post("/api/slack/respond", response_model=GenerateResponse)
def slack_respond(req: SlackRespondRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="question must not be empty")
    try:
        cid, channel_name, messages = _slack_thread_context()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

    combined = slack_integration.build_slack_prompt(
        req.question.strip(),
        messages,
        channel_name,
        req.history or None,
    )
    result = _build_generate_response(GenerateRequest(message=combined, scope="Slack"))

    if req.postToSlack:
        if not cid:
            raise HTTPException(
                status_code=400,
                detail="Posting to Slack requires SLACK_BOT_TOKEN and SLACK_CHANNEL_ID in api/.env.",
            )
        try:
            slack_integration.post_message(cid, result.content[:3900])
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Generated answer but failed to post to Slack: {e}") from e

    return result


def _slack_generate_reply(question: str) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return "Atlas is not configured (missing OPENAI_API_KEY)."
    try:
        content, _ = atlas_core.generate_response(question, api_key)
        return content
    except Exception as e:
        return f"Generation failed: {e}"


@app.post("/api/slack/events")
async def slack_events(request: Request, background_tasks: BackgroundTasks):
    body = await request.body()
    timestamp = request.headers.get("X-Slack-Request-Timestamp")
    signature = request.headers.get("X-Slack-Signature")
    if not slack_integration.verify_request_signature(timestamp, signature, body):
        raise HTTPException(status_code=401, detail="Invalid Slack signature")

    import json

    payload = json.loads(body.decode("utf-8"))
    if payload.get("type") == "url_verification":
        return {"challenge": payload.get("challenge")}

    if payload.get("type") == "event_callback":
        event = payload.get("event") or {}
        if event.get("type") == "app_mention" and not event.get("bot_id"):
            background_tasks.add_task(slack_integration.handle_app_mention, event, _slack_generate_reply)
        return {"ok": True}

    return {"ok": True}


NewsSourceId = Literal["google", "bloomberg"]


@app.get("/api/news/headlines")
def news_headlines(q: str = "AI product management", source: NewsSourceId = "google", limit: int = 8):
    try:
        headlines = news_integration.fetch_headlines(q, source=source, limit=limit)
        return {"query": q, "source": source, "headlines": headlines}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch headlines: {e}") from e


@app.get("/api/news/competitor-pulse")
def competitor_pulse(limit: int = 6):
    """Legacy endpoint — prefer /api/competitors/metrics."""
    try:
        tracks = news_integration.fetch_competitor_pulse(limit_per=min(max(limit, 3), 10))
        return {"updated": "live", "competitors": tracks}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to load competitor pulse: {e}") from e


class CustomMetricModel(BaseModel):
    id: str
    label: str
    value: str
    unit: str = ""


class CompanyTrackModel(BaseModel):
    id: str
    name: str
    ticker: str = ""
    newsQuery: str = ""
    metricTypes: list[str] = ["news_7d"]
    customMetrics: list[CustomMetricModel] = []


class CompetitorConfigModel(BaseModel):
    companies: list[CompanyTrackModel]


class AddCompanyRequest(BaseModel):
    name: str
    ticker: str = ""
    newsQuery: str = ""


class AddCustomMetricRequest(BaseModel):
    label: str
    value: str
    unit: str = ""


@app.get("/api/competitors/config")
def get_competitor_config():
    return competitor_metrics.load_config()


@app.put("/api/competitors/config")
def put_competitor_config(body: CompetitorConfigModel):
    competitor_metrics.update_config_companies(body.model_dump())
    return competitor_metrics.load_config()


@app.get("/api/competitors/metrics")
def get_competitor_metrics():
    try:
        companies = competitor_metrics.resolve_all()
        return {"source": "yahoo_finance+sec_edgar", "companies": companies}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.post("/api/competitors/companies")
def post_competitor_company(req: AddCompanyRequest):
    if not req.name.strip():
        raise HTTPException(status_code=400, detail="name is required")
    cfg = competitor_metrics.load_config()
    entry = competitor_metrics.add_company(cfg, req.name, req.ticker, req.newsQuery)
    return {"company": entry, "config": competitor_metrics.load_config()}


@app.post("/api/competitors/companies/{company_id}/metrics")
def post_custom_metric(company_id: str, req: AddCustomMetricRequest):
    if not req.label.strip() or not req.value.strip():
        raise HTTPException(status_code=400, detail="label and value are required")
    cfg = competitor_metrics.load_config()
    try:
        metric = competitor_metrics.add_custom_metric(cfg, company_id, req.label, req.value, req.unit)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    return {"metric": metric, "config": competitor_metrics.load_config()}


@app.delete("/api/competitors/companies/{company_id}")
def delete_competitor_company(company_id: str):
    cfg = competitor_metrics.load_config()
    competitor_metrics.remove_company(cfg, company_id)
    return competitor_metrics.load_config()


class NewsAnalyzeRequest(BaseModel):
    query: str = "AI product management tools"
    source: NewsSourceId = "google"
    question: Optional[str] = None
    limit: int = 8


@app.post("/api/news/analyze", response_model=GenerateResponse)
def news_analyze(req: NewsAnalyzeRequest):
    try:
        headlines = news_integration.fetch_headlines(req.query, source=req.source, limit=req.limit)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch headlines: {e}") from e

    news_block = news_integration.format_headlines_for_prompt(headlines, req.source)
    question = (req.question or "").strip() or (
        "Write a marketing analysis: key themes, competitor moves, risks, and recommended GTM actions for Atlas. "
        "Cross-reference internal KB evidence where relevant."
    )
    combined = f"{news_block}\n\n## Analysis request\n{question}"
    scope = "Google News" if req.source == "google" else "Bloomberg"
    return _build_generate_response(GenerateRequest(message=combined, agent="market", scope=scope))
