"""Slack Web API + Events API helpers for Atlas demo integration."""

from __future__ import annotations

import hashlib
import hmac
import os
import re
import time
from typing import Any

import httpx

SLACK_API_BASE = "https://slack.com/api"

# Shown in the UI when SLACK_BOT_TOKEN is not set (matches KB theme: payment failures).
DEMO_CHANNEL = {"id": "demo", "name": "product-payments", "is_member": True}
DEMO_MESSAGES: list[dict[str, Any]] = [
    {"ts": "1", "user": "U-sarah", "text": "Payment failure rate is up 12% this month — seeing it in support too.", "threadTs": None},
    {"ts": "2", "user": "U-alex", "text": "Root cause looks like a timeout in the Stripe webhook handler from v2.3.1.", "threadTs": None},
    {"ts": "3", "user": "U-jordan", "text": "JIRA-441 is already in progress for webhook retries. Do we need a hotfix?", "threadTs": None},
    {"ts": "4", "user": "U-sarah", "text": "@Atlas can you summarize this thread and recommend what PM should do next?", "threadTs": None},
]


def bot_token() -> str | None:
    token = os.environ.get("SLACK_BOT_TOKEN", "").strip()
    return token or None


def signing_secret() -> str | None:
    secret = os.environ.get("SLACK_SIGNING_SECRET", "").strip()
    return secret or None


def default_channel_id() -> str | None:
    channel = os.environ.get("SLACK_CHANNEL_ID", "").strip()
    return channel or None


def is_configured() -> bool:
    return bot_token() is not None


def demo_messages(limit: int = 20) -> list[dict[str, Any]]:
    return DEMO_MESSAGES[-min(max(limit, 1), 50) :]


def demo_channel() -> dict[str, Any]:
    return dict(DEMO_CHANNEL)


def verify_request_signature(timestamp: str | None, signature: str | None, body: bytes) -> bool:
    secret = signing_secret()
    if not secret or not timestamp or not signature:
        return False
    try:
        if abs(time.time() - int(timestamp)) > 60 * 5:
            return False
    except ValueError:
        return False
    base = f"v0:{timestamp}:{body.decode('utf-8')}"
    expected = "v0=" + hmac.new(secret.encode(), base.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def _api(method: str, *, params: dict | None = None, json_body: dict | None = None) -> dict[str, Any]:
    token = bot_token()
    if not token:
        raise RuntimeError("SLACK_BOT_TOKEN is not configured")
    headers = {"Authorization": f"Bearer {token}"}
    url = f"{SLACK_API_BASE}/{method}"
    with httpx.Client(timeout=30.0) as client:
        if json_body is not None:
            resp = client.post(url, headers=headers, json=json_body)
        else:
            resp = client.get(url, headers=headers, params=params or {})
    data = resp.json()
    if not data.get("ok"):
        err = data.get("error", "unknown_error")
        raise RuntimeError(f"Slack API {method} failed: {err}")
    return data


def resolve_channel_id(channel: str | None = None) -> str:
    explicit = (channel or default_channel_id() or "").strip()
    if not explicit:
        raise RuntimeError("Set SLACK_CHANNEL_ID in api/.env (channel ID like C0123456789)")
    if explicit[0] in ("C", "G", "D"):
        return explicit
    name = explicit.lstrip("#").lower()
    cursor: str | None = None
    while True:
        params: dict[str, Any] = {"types": "public_channel,private_channel", "limit": 200}
        if cursor:
            params["cursor"] = cursor
        data = _api("conversations.list", params=params)
        for ch in data.get("channels", []):
            if ch.get("name", "").lower() == name:
                return ch["id"]
        cursor = (data.get("response_metadata") or {}).get("next_cursor")
        if not cursor:
            break
    raise RuntimeError(f"Could not find Slack channel '{explicit}'. Invite the bot and check the name/ID.")


def channel_info(channel_id: str) -> dict[str, Any]:
    data = _api("conversations.info", params={"channel": channel_id})
    ch = data.get("channel") or {}
    return {"id": ch.get("id"), "name": ch.get("name"), "is_member": ch.get("is_member", False)}


def fetch_messages(channel_id: str | None = None, limit: int = 20) -> list[dict[str, Any]]:
    cid = resolve_channel_id(channel_id)
    data = _api("conversations.history", params={"channel": cid, "limit": min(max(limit, 1), 50)})
    messages = []
    for msg in reversed(data.get("messages", [])):
        if msg.get("subtype") in ("channel_join", "channel_leave", "bot_message"):
            continue
        text = msg.get("text") or ""
        text = re.sub(r"<@(U\w+)>", "@user", text)
        messages.append(
            {
                "ts": msg.get("ts"),
                "user": msg.get("user"),
                "text": text.strip(),
                "threadTs": msg.get("thread_ts"),
            }
        )
    return messages


def format_thread_for_prompt(messages: list[dict[str, Any]], channel_name: str | None) -> str:
    label = f"#{channel_name}" if channel_name else "Slack channel"
    lines = [f"## Live Slack thread ({label})"]
    for m in messages[-15:]:
        lines.append(f"- {m.get('text', '')}")
    return "\n".join(lines)


def format_conversation_history(history: list[dict[str, Any]]) -> str:
    if not history:
        return ""
    lines = ["## Follow-up conversation (this session)"]
    for turn in history[-8:]:
        role = turn.get("role", "user")
        text = (turn.get("text") or "").strip()
        if not text:
            continue
        label = "User" if role == "user" else "Atlas"
        lines.append(f"- **{label}:** {text[:800]}")
    return "\n".join(lines)


def build_slack_prompt(
    question: str,
    messages: list[dict[str, Any]],
    channel_name: str | None,
    history: list[dict[str, Any]] | None = None,
) -> str:
    prefix = format_thread_for_prompt(messages, channel_name)
    parts = [prefix]
    if history:
        parts.append(format_conversation_history(history))
    parts.append(f"## Question\n{question.strip()}")
    return "\n\n".join(parts)


def post_message(channel_id: str, text: str, thread_ts: str | None = None) -> None:
    body: dict[str, Any] = {"channel": channel_id, "text": text, "mrkdwn": True}
    if thread_ts:
        body["thread_ts"] = thread_ts
    _api("chat.postMessage", json_body=body)


def strip_bot_mention(text: str) -> str:
    return re.sub(r"<@\w+>", "", text).strip()


def handle_app_mention(event: dict[str, Any], generate_fn) -> None:
    """generate_fn(question: str) -> str"""
    channel = event.get("channel")
    if not channel:
        return
    question = strip_bot_mention(event.get("text") or "")
    if not question:
        question = "Summarize what this channel has been discussing and recommend next product actions."
    thread_ts = event.get("thread_ts") or event.get("ts")
    try:
        cid = resolve_channel_id(channel)
        info = channel_info(cid)
        msgs = fetch_messages(cid, limit=15)
        full_question = build_slack_prompt(question, msgs, info.get("name"), None)
        full_question = full_question.replace("## Question\n", "## Question from Slack\n", 1)
        reply = generate_fn(full_question)
        post_message(channel, reply[:3900], thread_ts=thread_ts)
    except Exception as e:
        post_message(channel, f"Atlas could not respond: {e}", thread_ts=thread_ts)
