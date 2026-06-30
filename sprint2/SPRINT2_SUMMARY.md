# Atlas — Sprint 2 Summary

## Score Progression

| Version | Overall | Modal | Edge | Out-of-Scope | Adversarial |
|---------|---------|-------|------|--------------|-------------|
| v0.1 (Sprint 1 baseline) | 68.0% | 73% | 50% | 100% | 100% |
| v0.2 (Sprint 1 final)    | 90.0% | 83% | 83% | 100% | 100% |
| **v0.3 (Sprint 2)**      | **100.0%** | **100%** | **100%** | **100%** | **100%** |

## Sprint 1 Failure Modes Identified

Auto-scoring revealed two root causes behind all 10 partial failures:

| Failure type | Affected IDs | Root cause |
|---|---|---|
| Modal partials (5) | 11, 16, 19, 25, 29 | Confidence score present but not reliably formatted — auto-scorer missed it |
| Edge partials (5) | 31, 33, 36, 38, 41 | Uncertainty flag implicit in prose — not in a dedicated, detectable section |

## Sprint 2 Changes

### 1. Prompt v0.3 (`atlas_app_v0.3.py`)
Two targeted rule changes, no rewrites:
- **Rule 2 → Bold format**: `Confidence: [H/M/L]` → `**Confidence: [High/Medium/Low]**` on its own line
- **Rule 4 → Explicit section**: Added mandatory `## Uncertainty Flags` section for sparse/ambiguous inputs

### 2. Knowledge Base v2 (`knowledge_base_v2.json`)
Expanded to close thin-context gaps on edge cases:

| Resource | Sprint 1 | Sprint 2 | Added |
|---|---|---|---|
| Customer feedback | 10 | 17 | CF-011–CF-017 |
| Jira tickets | 8 | 13 | JIRA-501, 488, 503, 510, 515 |
| Historical PRDs | 3 | 5 | PRD-2024-004, PRD-2025-001 |
| Competitors | 2 | 3 | Competitor C |

New coverage: `financial_tracking`, `growth`, `account_management`, `ai_features` (all previously thin).

### 3. Eval Harness v0.3 (`eval_harness_v0.3.py`)
- `auto_score` returns per-dimension breakdown: `citation / confidence / structure / uncertainty / refusal`
- Failure mode report printed at end of every run (grouped by missing dimension)
- `--version both` now compares v0.2 vs v0.3 and writes a delta CSV
- Results saved to `eval_results/` subfolder for organization

## Versioned Results

| File | Version | Score |
|---|---|---|
| `eval_results/eval_results_v0.3.csv` | v0.3 | 100% |
| `eval_results/version_comparison_v0.2_vs_v0.3.csv` | delta | 10 improved, 0 regressed |

Sprint 1 results are in `../sprint1/eval_results_v0.1.csv` and `../sprint1/eval_results_v0.2.csv`.

## Running the Eval

```bash
# Sprint 2 eval (v0.3 only)
python sprint2/eval_harness_v0.3.py --api-key sk-... --version v0.3

# Full comparison: v0.2 vs v0.3
python sprint2/eval_harness_v0.3.py --api-key sk-... --version both

# Run the Sprint 2 app
streamlit run sprint2/atlas_app_v0.3.py
```
