# Atlas — Recorded Demo (Script + Shot List)

**Goal:** One polished **8–10 minute** screen recording for Sprint 2 / stakeholder review.  
**Branch:** `frontend-integration`  
**Stack:** React `http://127.0.0.1:5173` · API `http://127.0.0.1:8787`

Companion doc for live Q&A: [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

---

## 1. Before you hit Record

### Environment

```bash
cd CMU_AI_prototype_Atlas
git pull origin frontend-integration
cp -n api/.env.example api/.env    # OPENAI_API_KEY required for live LLM beats
chmod +x scripts/demo.sh
./scripts/demo.sh
```

Verify: `curl -s http://127.0.0.1:8787/api/health` → `"ok": true`

### Browser (clean take)

1. **Chrome / Edge**, zoom **100%**, window **1440×900** or full screen 1080p.
2. **Incognito** window → `http://127.0.0.1:5173` (empty recent chats; predictable demo).
3. Hide bookmarks bar; close unrelated tabs.
4. **Never** open `api/.env` on screen.

### Recording settings

| Setting | Recommendation |
|--------|------------------|
| Tool | OBS, Loom, QuickTime (screen only), or Zoom “Record to cloud” |
| Resolution | 1920×1080 @ 30fps |
| Mic | Headset; test levels; room quiet |
| Cursor | Enable “highlight cursor” if your tool supports it |
| Length | Stop at **~9:00**; trim dead air in post |

### Optional cold open (5 sec)

Full-screen title slide: **Atlas — Multi-agent product workspace · Sprint 2**  
Then cut to browser on homepage.

---

## 2. Story in one line (say this early)

> Atlas is one workspace where four specialized agents turn our org knowledge into evidence-grounded artifacts—with citations, confidence scores, and clear handoffs—not a single generic chatbot.

---

## 3. Scene-by-scene script

Use **On screen** for mouse/keyboard; **Say** for voiceover.  
Times are cumulative from **0:00** after the browser is visible.

---

### Scene 1 — Homepage · command center (0:00 – 1:20)

| Time | On screen | Say |
|------|-----------|-----|
| 0:00 | Homepage: **Hello, Ifra.** + welcome subline. Pause on ask bar. | “This is Atlas—my multi-agent workspace. One home screen for ask, portfolio, competitors, and four role agents.” |
| 0:20 | Scroll slightly: **Portfolio** and **Competitor pulse** widgets. | “I see active initiatives and a competitor snapshot without jumping into four different tools.” |
| 0:40 | Point to **Agent** + **All apps** pills on ask bar (don’t open yet). | “Routing is explicit: I pick an agent and optionally scope to a connected app before I send.” |
| 0:55 | Open **Agent** → select **Product Agent**. | “I’ll pin Product for this first question.” |
| 1:05 | Type (don’t send yet): show prompt in cheat sheet below. | “I’ll ask for themes tied to work we already have in flight.” |

**Send prompt (Product · All apps):**

```text
Summarize customer feedback themes related to unified notification controls. Cite sources.
```

| 1:10 | Send (↑). Wait for typing indicator → response. Scroll citations + **Confidence**. | “Every claim ties back to IDs in our knowledge base—customer feedback, Jira, PRDs—and the model must end with a confidence line. That’s the Sprint 2 v0.3 bar we hit at 100% eval.” |

**If generation fails:** Show ⚠️ message. Say: “Atlas surfaces API failures instead of making things up.” Cut to Scene 4 PRD (pre-generated UI) and continue.

---

### Scene 2 — Threads & recent conversations (1:20 – 2:10)

| Time | On screen | Say |
|------|-----------|-----|
| 1:20 | Scroll to **Recent conversations** — Product thread appears. | “Chats save per agent in the browser. I don’t get a wall of history in the ask bar until I choose to resume.” |
| 1:35 | Click the **Product** row → expanded ask card + **Pick up where you left off**. | “I can continue exactly where I left off.” |
| 1:50 | Click **×** (top right of ask card) to close. | “Or I collapse and start fresh—same pattern inside each agent workspace.” |
| 2:00 | Ask bar compact again. | “Home stays calm; depth is one click away.” |

---

### Scene 3 — Product workspace · PRD (2:10 – 4:00)

| Time | On screen | Say |
|------|-----------|-----|
| 2:10 | Click **Product** agent card (or sidebar **Product**). | “Each agent is its own workspace with tools—not four tabs on the same bot.” |
| 2:25 | Dashboard: **Chat history** card → **Continue chat** vs **Start new chat**. | “From the overview I can continue or wipe the thread and open a clean chat—useful before a demo or a new initiative.” |
| 2:40 | Click **Start new chat** (optional) or **Continue chat** → inline chat opens. | “Inline chat uses the same backend retrieval and specialized Product prompt.” |
| 2:55 | **PRD Generator** in sidebar. Chip **Unified notification controls** → **Generate**. | “For structured artifacts we use dedicated tools—here, idea to PRD with the same core as our evaluated Streamlit v0.3 app.” |
| 3:30 | Scroll PRD: **Uncertainty Flags**, citations, confidence. | “When evidence is thin, Uncertainty Flags show up—that was a key Sprint 2 eval fix.” |
| 3:50 | Top bar **Chat** or search-style ask → one short follow-up optional. | “Product and header chat share one thread per agent.” |

**Optional inline Product prompt:**

```text
Generate a PRD outline aligned to our roadmap priority: notification preference center.
```

---

### Scene 4 — Market · live intel (4:00 – 5:30)

| Time | On screen | Say |
|------|-----------|-----|
| 4:00 | Sidebar → **Market** agent. | “Market focuses on competitive intelligence and strategy.” |
| 4:15 | Overview **Competitor pulse** — charts / metrics. | “Where we have tickers, prices and earnings come from real feeds—not placeholder charts.” |
| 4:35 | **Market Report** (or **Signals**) → topic **AI product management** → generate if time. | “Public headlines plus KB-backed analysis for positioning.” |
| 4:55 | **Chat** → **Market Agent** dropdown already implied. Paste: | |

```text
Draft a concise marketing strategy for enterprise positioning vs Competitor A and B. Use competitor intel from context.
```

| 5:15 | Show structured sections in reply. | “Market gets its own system prompt and retrieval bias toward competitor intel.” |

---

### Scene 5 — Engineering · ADR (5:30 – 6:30)

| Time | On screen | Say |
|------|-----------|-----|
| 5:30 | **Engineering** workspace → **Tech Spec** or open **ADR** view. | “Engineering handles ADRs and specs—not PRD prose.” |
| 5:45 | **Tech Spec** → default chip **Notification settings API** → **Generate**. | “Same retrieval layer, different artifact template.” |
| 6:10 | Or **Chat**: | |

```text
Draft an ADR for vector database selection for the Atlas RAG layer. Include options and consequences.
```

| 6:20 | Brief scroll of ADR-style sections. | “Evidence still cites Jira and historical PRDs where relevant.” |

**8-min cut:** Skip Scene 5; go Scene 4 → Scene 6.

---

### Scene 6 — Sales · executive pitch (6:30 – 8:00)

| Time | On screen | Say |
|------|-----------|-----|
| 6:30 | **Sales** workspace. Dashboard chat card. | “Sales uses the same knowledge layer for deal-ready narratives.” |
| 6:45 | **Chat** — ensure **Sales** in agent menu. Paste: | |

```text
Executive sales pitch: why our product wins vs alternatives given current market trends. Include proof points from customer feedback.
```

| 7:20 | Scroll pitch sections + citations. | “This is scoped to Sales retrieval—competitor intel plus customer proof—not a generic PM refusal.” |
| 7:40 | **Battle Cards** → pick **Productboard** (static UI OK). | “Battle cards and deal briefs live in the same agent shell.” |
| 7:55 | Home → **Recent conversations** → **Sales** row visible. | “Because I tagged Sales from home, the thread shows up here and on the Sales overview.” |

---

### Scene 7 — Integrations & close (8:00 – 9:00)

| Time | On screen | Say |
|------|-----------|-----|
| 8:00 | Any agent → **Integrations**. Scroll connected apps. | “Integrations set scope—Slack and news paths are wired on the API; others frame the ask and handoffs like Gmail compose.” |
| 8:20 | **Slack demo** page briefly OR home **All apps → Slack** + preview under ask bar. | “With a bot token this is live; in demo mode we still show realistic channel context.” |
| 8:40 | Return home; stat strip: **100% eval**, **38 KB**, **4 agents**. | “Sprint 2: expanded KB, 100% eval on v0.3, and this UI exposing agents, threads, citations, and scope. Same core powers Streamlit and this React prototype.” |
| 8:55 | Hold on logo / homepage. | “Thanks—happy to dive into eval harness or architecture in Q&A.” |

---

## 4. Prompt cheat sheet (copy-paste)

| Scene | Agent / scope | Prompt |
|-------|----------------|--------|
| 1 | Home · Product · All apps | `Summarize customer feedback themes related to unified notification controls. Cite sources.` |
| 3 | Product · chat | `Generate a PRD outline aligned to our roadmap priority: notification preference center.` |
| 4 | Market · chat | `Draft a concise marketing strategy for enterprise positioning vs Competitor A and B. Use competitor intel from context.` |
| 5 | Engineering · chat | `Draft an ADR for vector database selection for the Atlas RAG layer. Include options and consequences.` |
| 6 | Sales · chat | `Executive sales pitch: why our product wins vs alternatives given current market trends. Include proof points from customer feedback.` |
| Slack | Home · Slack scope | `Summarize the payment failure discussion and recommended next steps.` |

---

## 5. Post-production checklist

- [ ] Trim leading/trailing silence; target **7:30–9:30** final.
- [ ] Blur any accidental `.env` or API key flash.
- [ ] Optional lower-third once: **Atlas · Sprint 2 · frontend-integration**
- [ ] Export **1080p MP4**; upload to course portal / Drive.
- [ ] In submission text, link repo + commit hash: `git rev-parse --short HEAD`

---

## 6. Troubleshooting while recording

| Issue | Action |
|-------|--------|
| Slow LLM | Record UI-only scenes first; batch generate prompts; edit order in post |
| Port in use | `lsof -ti :8787 \| xargs kill` then re-run `./scripts/demo.sh` |
| Stale API code | Restart uvicorn (demo script or `cd api && uvicorn main:app --reload --port 8787`) |
| Wrong thread on Sales home | Pick **Sales Agent** in dropdown before send; see `headerChat.ts` routing |

---

## 7. Teleprompter block (full voiceover, ~650 words)

Read naturally; pauses where you interact with the UI.

> This is Atlas—my multi-agent workspace. One home screen for asking questions, tracking portfolio work, watching competitors, and opening four specialized agents.
>
> I route each question deliberately: pick an agent, optionally scope to an app, then send. I’ll start with Product and ask for customer themes around unified notification controls. Watch the answer—citations on every claim, plus a confidence score. That’s our Sprint 2 v0.3 standard—we hit one hundred percent on the eval harness with this format.
>
> Conversations save per agent. Recent chats appear here; I expand only when I want to resume, or I close the card to start fresh.  
>
> Each agent opens a real workspace. On Product I can continue or start a new chat from the overview, generate a PRD from a chip, and see uncertainty flags when evidence is thin. Same retrieval core as our Streamlit app—now in a product shell.
>
> Market adds competitor pulse with live metrics where we have data, plus chat tuned for analysis and marketing strategy. Engineering produces ADRs and tech specs. Sales generates executive pitches grounded in competitor intel and customer proof—not generic product copy.
>
> Integrations define scope; Slack and news have API paths, and Gmail is a human-in-the-loop handoff.  
>
> Sprint 2 expanded the knowledge base, fixed eval failure modes, and shipped this UI: agents, threads, citations, and scope in one place. Thanks for watching.

---

*Last updated for commit `frontend-integration` (homepage widgets, agent prompts, per-agent chat threads, start-new-chat on dashboards).*
