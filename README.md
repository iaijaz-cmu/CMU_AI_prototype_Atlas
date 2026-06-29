# Atlas — AI Product Intelligence Platform
## Sprint 1 Deliverables

Atlas transforms fragmented organizational context (Slack, Jira, customer feedback) into structured, evidence-grounded product artifacts: PRDs, roadmap recommendations, Jira stories, and feature requirements.

---

## Deliverables

| File | Deliverable |
|------|-------------|
| `atlas/atlas_app.py` | Walking-skeleton prototype (Streamlit) |
| `atlas/knowledge_base.json` | Local retrieval knowledge base |
| `atlas/eval_harness.py` | Automated evaluation harness |
| `atlas/requirements.txt` | Python dependencies |
| `Atlas_Evaluation_Set_v1.xlsx` | 50-example evaluation dataset |
| `eval_results_v0.1.csv` | Versioned results — v0.1 (68% overall) |
| `eval_results_v0.2.csv` | Versioned results — v0.2 (90% overall) |
| `version_comparison.csv` | Side-by-side version comparison |
| `Atlas_Sprint1_Summary.docx` | Sprint 1 one-page summary |

---

## Architecture

```
User Input → Retrieval (JSON KB) → System Prompt → GPT-4o Mini → Output + CSV Log
```

- **Frontend:** Streamlit
- **Retrieval:** Local JSON knowledge base (keyword-based theme matching)
- **Model:** GPT-4o Mini (temp 0.3)
- **Evaluation:** Auto-scored harness + in-app manual logging

---

## Running the Prototype

```bash
cd atlas
pip install -r requirements.txt
streamlit run atlas_app.py
```

Enter your OpenAI API key in the sidebar when the app opens.

---

## Running the Evaluation Harness

```bash
# Run a single version
python atlas/eval_harness.py --api-key sk-... --version v0.2

# Run both versions and generate comparison
python atlas/eval_harness.py --api-key sk-... --version both
```

---

## Evaluation Results Summary

| Category | v0.1 | v0.2 | Delta |
|----------|------|------|-------|
| **Overall** | 68% | **90%** | +22 pts |
| Modal (30) | 78% | 92% | +14 pts |
| Edge (12) | 33% | 79% | +46 pts |
| Out-of-Scope (5) | 90% | 100% | +10 pts |
| Adversarial (3) | 67% | 100% | +33 pts |

Key improvement in v0.2: added citation constraints, confidence scoring, structured output rules, scope refusal, and adversarial guardrails.
