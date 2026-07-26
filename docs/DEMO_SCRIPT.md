# Atlas Sprint 2 — Live Demo Script

**Audience:** Course stakeholders / sprint review  
**Length:** ~12 minutes live · **~9 minutes recorded** (see [RECORDED_DEMO.md](./RECORDED_DEMO.md))  
**App:** React UI + FastAPI (`frontend-integration`)  
**URLs:** Frontend `http://127.0.0.1:5173` · API `http://127.0.0.1:8787/api/health`

---

## Before you go live (5 min)

1. Run `./scripts/demo.sh` from repo root.
2. Confirm health: `curl -s http://127.0.0.1:8787/api/health` → `"ok": true`.
3. Open **http://127.0.0.1:5173** (incognito for a clean take when recording).
4. Ensure `api/.env` has **`OPENAI_API_KEY`** (never share screen with the file open).
5. Optional: collapse home sidebar (click Atlas logo row) for a wider hero + ask bar.

**Recording?** Follow **[RECORDED_DEMO.md](./RECORDED_DEMO.md)** scene-by-scene.

**If the model is slow:** UI-only beats first (portfolio, competitor pulse, PRD UI, battle cards), then one live generation.

**If the model errors:** Say *“Atlas surfaces the failure instead of hallucinating”*; show ⚠️ or fall back to **Product → PRD** output already on screen.

---

## Narrative arc (one sentence)

*Atlas is one workspace where four specialized agents turn org knowledge into evidence-grounded artifacts—with citations, confidence, and resume-or-reset chat—not another generic chat tab.*

---

## Act 1 — Home & unified ask (3 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | Land on **home**. Hero: **Hello, Ifra.** + welcome subline. | “Multi-agent workspace—one front door.” |
| 2 | Scroll **Portfolio** + **Competitor pulse**. | “Portfolio and market pulse on the same page as ask.” |
| 3 | **Ask card**: **Agent** → **Product Agent**; **All apps** stays broad. | “Agent and app scope are separate controls.” |
| 4 | Send: `Summarize customer feedback themes related to unified notification controls. Cite sources.` | “Citations + confidence from our KB.” |
| 5 | **Recent conversations** → open **Product** row → **Pick up where you left off** → **×** to collapse. | “Per-agent threads; expand only when resuming.” |
| 6 | Optional follow-up in same thread. | “Multi-turn header chat persists in this browser.” |

**8-min cut:** One home prompt + show Recent conversations only.

---

## Act 2 — Product agent (2.5 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | Open **Product** workspace. | “Dedicated tools, not a reskin.” |
| 2 | Dashboard **Chat history** → **Continue chat** / **Start new chat**. | “Resume or wipe the agent thread before a new initiative.” |
| 3 | **PRD Generator** → chip **Unified notification controls** → **Generate**. | “Same v0.3 core as Streamlit; structured PRD output.” |
| 4 | Citations, **Uncertainty Flags**, confidence. | “Sprint 2 eval fix—honest gaps.” |
| 5 | **Chat** or top ask → optional: `Generate a PRD outline aligned to our roadmap priority: notification preference center.` | “Product-specific LLM prompt + retrieval.” |

---

## Act 3 — Market agent (2 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | **Market** workspace → **Competitor pulse**. | “Live metrics where tickers exist.” |
| 2 | **Market Report** / **Signals** (optional generate). | “Headlines + KB analysis.” |
| 3 | **Chat:** `Draft a concise marketing strategy for enterprise positioning vs Competitor A and B.` | “Market agent template—not PM-only scope.” |

---

## Act 4 — Engineering & Sales (2 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | **Engineering** → **Tech Spec** or **ADR** view; generate or chat ADR prompt. | “ADRs and specs for eng.” |
| 2 | **Sales** → **Chat:** executive pitch prompt (see cheat sheet). | “Sales pitch with competitor + customer citations.” |
| 3 | **Battle Cards** → Productboard. | “Deal artifacts in the same shell.” |
| 4 | Home → **Recent conversations** shows **Sales** if you tagged Sales from home. | “Home + workspace share per-agent threads.” |

**8-min cut:** Engineering **or** Sales, not both.

---

## Act 5 — Integrations (1.5 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | **Integrations** tool. | “Connected apps = scope + handoffs.” |
| 2 | **Slack demo** or home **Slack** scope + channel preview. | “Live with token; demo channel otherwise.” |
| 3 | **Open in Gmail** on a reply (after generate). | “Human sends the email.” |

---

## Close (30 sec)

“Sprint 2: **90% → 100% eval**, expanded KB, specialized agent prompts, and this UI—agents, threads, citations, scope. Same `atlas_core` powers Streamlit v0.3 and React.”

**Q&A:** `sprint2/eval_harness_v0.3.py` · `knowledge_base_v2.json` · `api/agent_prompts.py`

---

## Prompt cheat sheet

| Context | Prompt |
|---------|--------|
| Home · Product | `Summarize customer feedback themes related to unified notification controls. Cite sources.` |
| Product · chat | `Generate a PRD outline aligned to our roadmap priority: notification preference center.` |
| Market · chat | `Draft a concise marketing strategy for enterprise positioning vs Competitor A and B.` |
| Engineering · chat | `Draft an ADR for vector database selection for the Atlas RAG layer.` |
| Sales · chat | `Executive sales pitch: why our product wins vs alternatives given current market trends.` |
| Home · Slack | `Summarize the payment failure discussion and recommended next steps.` |

---

## Manual startup

```bash
# Terminal 1 — API
cd api && cp -n .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8787

# Terminal 2 — UI
cd frontend && npm install && npm run dev
```

Open **http://127.0.0.1:5173**.
