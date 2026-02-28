# siza-gen Python ML Sidecar (v0.5.0)

## Architecture
Python FastAPI sidecar at `python/siza_ml/` handles compute-intensive ML operations.
TypeScript orchestrates generation, registry, and delegates to sidecar when available.

Communication: HTTP on port 8100, base64-encoded float32 vectors for compact wire format.

Degradation chain: Python sidecar → Transformers.js/local LLM → pure heuristics.

## Python Modules
- `embeddings.py` — sentence-transformers (all-MiniLM-L6-v2, 384-dim), lazy loading
- `vector_store.py` — FAISS IndexFlatIP, persist to `.uiforge/faiss.index`
- `quality_scorer.py` — Ollama LLM scoring + heuristic fallback
- `prompt_enhancer.py` — Ollama enhancement + rule-based fallback
- `training.py` — LoRA fine-tuning via PEFT (TinyLlama, rank-8, CPU-only, background threads)
- `data_ingestion.py` — HuggingFace dataset streaming + axe-core rule ingestion
- `metrics.py` — ML observability, JSONL storage, p95 aggregation
- `health.py` — liveness + readiness probes with memory stats

## TS Integration
- `sidecar-client.ts` — HTTP client with 30s availability cache, 5s/10s timeouts
- All ML modules (embeddings, quality-scorer, prompt-enhancer, training-pipeline) delegate to sidecar

## Key Files
- `python/pyproject.toml` — deps: fastapi, sentence-transformers, faiss-cpu, peft, transformers
- `python/Dockerfile` — python:3.12-slim multi-stage (NOT alpine — FAISS needs glibc)
- `.github/workflows/python-ci.yml` — ruff + pytest on python/ changes
- `scripts/start-sidecar.sh` — uvicorn launcher

## Tests
- 41 Python tests (6 files: embeddings, vector_store, quality, training, ingestion, metrics)
- 12 new TS sidecar-client tests (424 total)

## Gotchas
- `.gitignore` had `test_*.py` without `/` prefix — blocked Python test files in subdirs. Fixed with `/test_*.py`
- Python .venv JS files (torch, sklearn) leak into ESLint — `python/` added to ESLint ignores
- `jest.spyOn(globalThis, 'fetch')` fails in Jest ESM — use manual mock pattern
- ruff B905: zip() needs strict=True
- ruff UP042: use StrEnum not str+Enum in Python 3.12+
- Port 8100 avoids conflicts with Ollama (11434), MCP (3000s), dev (5173)

## PR
- PR #4: feat/python-ml-sidecar → main, 38 files, +2861/-28 lines
