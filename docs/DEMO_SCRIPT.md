# Atlas Sprint 2 — Live Demo Script

**Audience:** Course stakeholders / sprint review  
**Length:** ~12 minutes (8-minute cut at § shortcuts)  
**App:** React UI + FastAPI (`frontend-integration` branch)  
**URLs:** Frontend `http://localhost:5173` · API `http://localhost:8787/api/health`

---

## Before you go live (5 min)

1. Run `./scripts/demo.sh` from repo root (or follow manual steps in that file).
2. Confirm health: `curl -s http://localhost:8787/api/health` → `"ok": true`.
3. Open **http://localhost:5173** in a clean browser window (zoom 100%, hide unrelated tabs).
4. Ensure `api/.env` has a valid **`OPENAI_API_KEY`** (never share screen with the file open).
5. Optional: collapse home sidebar once so the hero + ask bar are centered.

**If the model is slow:** Stay on UI-only beats first (agents, competitor charts, integrations shell), then run one live generation.

**If the model errors:** Say *“Atlas surfaces the failure instead of hallucinating”* and show the ⚠️ message; fall back to pre-opened **Product → PRD** result or **Eval Scores** on the dashboard.

---

## Narrative arc (one sentence)

*Atlas is one workspace where four role agents turn org knowledge into evidence-grounded artifacts—with citations, confidence, and human approval—not another generic chat tab.*

---

## Act 1 — Home & unified ask (3 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | Land on **home** (picker). Point to stat strip: KB, eval, cost, four agents. | “Sprint 2: v0.3 prompt, **100% eval**, 38 indexed docs, four specialized agents in one shell.” |
| 2 | Highlight **ask card** (no Ask/Research/Build pills—just type). | “Single entry point; routing is explicit, not hidden mode switches.” |
| 3 | Open **Agent** dropdown → **Any agent** vs **Product Agent**. | “I can stay broad or pin an agent before I send.” |
| 4 | Open **All apps** dropdown → **All apps** vs **Slack** (optional **Gmail**). | “Scope is separate—workspace-wide or tied to an integration.” |
| 5 | With **Product Agent** + **All apps**, send: | |
| | **Prompt:** `Summarize customer feedback themes related to unified notification controls.` | “Watch for **citations** and **confidence** in the reply—grounded in our KB, not free-form prose.” |
| 6 | Send a **follow-up** in the same thread (don’t refresh). | “Thread persists in the browser; this is multi-turn header chat, same backend history as the API.” |

**8-min cut:** Stop after one good answer; skip follow-up.

---

## Act 2 — Product agent (2.5 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | Click **Product** agent card (or sidebar **Product**). | “Each agent is a workspace with tools, not a skin on the same bot.” |
| 2 | **Overview** → **Competitor pulse** / activity / KB breakdown (if visible). | “Product sees org context at a glance.” |
| 3 | **PRD Generator** → click chip **Unified notification controls** → **Generate**. | “From idea to structured PRD in one flow—same retrieval + v0.3 prompt as Streamlit v0.3.” |
| 4 | Scroll output: citations, confidence, uncertainty flags. | “When evidence is thin, **Uncertainty Flags** fire—that’s the Sprint 2 eval fix.” |
| 5 | **Top bar → Ask Product Agent…** or **Chat** → inline chat. | “Same header thread continues here; agent dropdown still applies.” |

**Sample inline prompt:** `What open Jira themes support notification work?`

---

## Act 3 — Market agent & live data (2.5 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | **Switch workspace** → **Market** agent. | “Market focuses on intel, sizing, and signals.” |
| 2 | **Overview** → **Competitor pulse** widget. | “Real **Yahoo** price series and **SEC** EPS YoY where we have tickers—not decorative sparklines.” |
| 3 | Briefly open **editor** (if time): mention editable companies/metrics. | “PMs can tune the watchlist without redeploying.” |
| 4 | **Signals Feed** or **Market Report** tab. | “Public headlines plus KB-backed analysis.” |
| 5 | **Market Report** → topic e.g. `AI product management` → generate (optional). | “One report pipeline for positioning narratives.” |

---

## Act 4 — Engineering + Sales (2 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | **Engineering** → **Tech Spec** → chip **Notification settings API** → Generate. | “PRD → spec path for eng; stories and ADRs live in the same agent.” |
| 2 | **Sales** → **Battle Cards** → select competitor (e.g. Productboard). | “Sales gets deal-ready artifacts from the same knowledge layer.” |

**8-min cut:** Pick **either** Engineering **or** Sales, not both.

---

## Act 5 — Integrations & Slack scope (2 min)

| Step | Do | Say |
|------|-----|-----|
| 1 | **Product** (or any agent) → **Integrations**. | “Connected apps are first-class scope, not side metadata.” |
| 2 | Scroll to **Slack demo** section. | “Without a token we show **demo channel** `#product-payments`; with `SLACK_BOT_TOKEN`, this is live.” |
| 3 | Home → **All apps** → **Slack** → show preview snippet under ask bar. | “Scoped ask uses Slack-specific backend when I send from home.” |
| 4 | **Gmail**: mention **Open in Gmail** on assistant replies (after a generate). | “Draft handoff—human still sends.” |

---

## Close (30 sec)

| Say |
|-----|
| “Sprint 2 story: **90% → 100% eval** by fixing failure modes, expanded KB, and a product UI that exposes citations, scope, and approvals. Atlas is the shell; the same core powers Streamlit v0.3 and this React prototype.” |

**Q&A backups:** Eval harness in `sprint2/eval_harness_v0.3.py` · KB in `sprint2/knowledge_base_v2.json` · API parity via `api/atlas_core.py`.

---

## Prompt cheat sheet (copy-paste)

| Context | Prompt |
|---------|--------|
| Home · Product · All apps | `Summarize customer feedback themes related to unified notification controls.` |
| Home · follow-up | `Which Jira tickets align with that theme?` |
| Home · Slack scope | `Summarize the payment failure discussion and recommended next steps.` |
| Product · PRD | Use chip: **Unified notification controls** |
| Engineering · Tech spec | Use chip: **Notification settings API** (or default prompt) |
| Market · Report | Topic: `AI product management` |
| Slack demo | `Summarize this Slack discussion on payment failures` |
| Floating chat (bottom-right sparkle) | Tag **Market** → `What changed in competitor positioning this quarter?` |

---

## Manual startup (if `demo.sh` fails)

```bash
# Terminal 1 — API
cd api && cp -n .env.example .env   # edit OPENAI_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8787

# Terminal 2 — UI
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173**.
