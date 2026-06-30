# Atlas — AI Product Intelligence Platform

Atlas transforms fragmented organizational knowledge (Slack, Jira, customer feedback) into structured, evidence-grounded product artifacts: PRDs, roadmap recommendations, Jira stories, and feature requirements.

---

## Sprint Progress

| Sprint | Prompt | KB Size | Eval Score | Key Change |
|--------|--------|---------|------------|------------|
| Sprint 1 — v0.1 | Minimal | 10 CF / 8 Jira / 3 PRD | 68% | Walking skeleton |
| Sprint 1 — v0.2 | Structured rules | 10 CF / 8 Jira / 3 PRD | 90% | Citations + confidence score added |
| **Sprint 2 — v0.3** | **Strict format + Uncertainty Flags** | **17 CF / 13 Jira / 5 PRD** | **100%** | **Failure mode fixes** |

---

## Repository Structure

```
sprint1/
  atlas_app_v0.2.py          — Sprint 1 app (prompt v0.2)
  eval_harness_v0.2.py       — Sprint 1 eval harness
  knowledge_base_v1.json     — Sprint 1 KB (10 CF, 8 Jira, 3 PRD, 2 competitors)
  eval_results_v0.1.csv      — Baseline eval results (68%)
  eval_results_v0.2.csv      — Sprint 1 final results (90%)

sprint2/
  atlas_app_v0.3.py          — Sprint 2 app (prompt v0.3)
  eval_harness_v0.3.py       — Sprint 2 eval harness (per-dimension scoring)
  knowledge_base_v2.json     — Sprint 2 KB (17 CF, 13 Jira, 5 PRD, 3 competitors)
  SPRINT2_SUMMARY.md         — Failure mode analysis + change log
  eval_results/
    eval_results_v0.3.csv                    — Sprint 2 results (100%)
    version_comparison_v0.2_vs_v0.3.csv      — Delta: 10 improved, 0 regressed
```

---

## Architecture

```
User Input → Retrieval (JSON KB) → System Prompt → GPT-4o Mini → Output + CSV Log
```

- **Frontend:** Streamlit
- **Retrieval:** Local JSON knowledge base (keyword-based theme matching)
- **Model:** GPT-4o Mini (temp 0.3)
- **Evaluation:** Auto-scored harness (per-dimension) + in-app manual logging

---

## Sprint 1 Evaluation Results

| Category | v0.1 | v0.2 | Delta |
|----------|------|------|-------|
| **Overall** | 68% | **90%** | +22 pts |
| Modal (30) | 78% | 92% | +14 pts |
| Edge (12) | 33% | 79% | +46 pts |
| Out-of-Scope (5) | 90% | 100% | +10 pts |
| Adversarial (3) | 67% | 100% | +33 pts |

## Sprint 2 Evaluation Results

| Category | v0.2 | v0.3 | Delta |
|----------|------|------|-------|
| **Overall** | 90% | **100%** | +10 pts |
| Modal (30) | 83% | 100% | +17 pts |
| Edge (12) | 83% | 100% | +17 pts |
| Out-of-Scope (5) | 100% | 100% | — |
| Adversarial (3) | 100% | 100% | — |

---

## Quickstart

```bash
pip install -r requirements.txt

# Sprint 2 app (latest)
streamlit run sprint2/atlas_app_v0.3.py

# Sprint 1 app
streamlit run sprint1/atlas_app_v0.2.py

# Run Sprint 2 eval
python sprint2/eval_harness_v0.3.py --api-key sk-... --version v0.3

# Compare v0.2 vs v0.3
python sprint2/eval_harness_v0.3.py --api-key sk-... --version both
```
