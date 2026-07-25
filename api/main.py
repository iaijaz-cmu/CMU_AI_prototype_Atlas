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
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import atlas_core

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

_AGENT_FRAMING = {
    "product": "Respond as the Product agent — focus on PRDs, roadmap, and feature requirements.",
    "engineering": "Respond as the Engineering agent — focus on tech specs, Jira breakdowns, and architecture decisions.",
    "market": "Respond as the Market agent — focus on competitive intelligence and market sizing.",
    "sales": "Respond as the Sales agent — focus on battle cards, ICP fit, and deal context.",
}


class GenerateRequest(BaseModel):
    message: str
    agent: Optional[AgentId] = None
    scope: Optional[str] = None


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


@app.get("/api/health")
def health():
    return {"ok": True, "model": atlas_core.MODEL, "promptVersion": atlas_core.PROMPT_VERSION}


@app.post("/api/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured on the server. Add it to backend/api/.env and restart the API.",
        )
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message must not be empty")

    user_input = req.message.strip()
    framing = []
    if req.agent and req.agent in _AGENT_FRAMING:
        framing.append(_AGENT_FRAMING[req.agent])
    if req.scope:
        framing.append(f"The user scoped this question to the {req.scope} integration specifically.")
    if framing:
        user_input = f"{' '.join(framing)}\n\n{user_input}"

    try:
        content, ctx = atlas_core.generate_response(user_input, api_key)
    except Exception as e:  # surfaces OpenAI errors (bad key, rate limit, etc.) to the frontend
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
