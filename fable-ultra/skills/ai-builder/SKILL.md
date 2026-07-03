---
name: ai-builder
description: Build real AI products end to end — LLM apps, chatbots, RAG knowledge-base QA systems, embeddings and semantic search, AI agents, extraction/classification pipelines, and LLM evals. Trigger when the user says "build an AI", "create AI", "make a chatbot", "LLM app", "RAG", "knowledge base QA", "semantic search", "embeddings", "AI agent product", "LLM pipeline", "model eval", or asks whether to fine-tune vs prompt. Small-model-first — architectures that reach near-big-model quality on small/cheap models via decomposition, verification, and escalation routing.
---

# AI Builder

Honest scope: this skill builds AI SYSTEMS on top of existing models (API or local). Training a frontier model from scratch is out of scope on consumer hardware — but real AI products do not need that; they need the right architecture around a model that already exists.

## Architecture picker

| User need | Pattern |
|---|---|
| Conversational app | Claude API + streaming + conversation memory |
| Knowledge QA over documents | RAG (retrieve, then generate with citations) |
| Structured extraction (docs, images, text) | Vision/text model + JSON schema structured output |
| Classification / routing | Small model + few-shot examples from a golden set |
| Multi-step automation | Agent loop with tools (act, observe, repeat) |
| Offline / private data | Local model via Ollama |

## Claude API rules

- BEFORE writing any Claude API code, consult the `claude-api` skill (installed) for current model ids, pricing, and parameters. NEVER hardcode model knowledge from memory — it goes stale.
- Default to the latest models listed there; pick the smallest that passes your eval.
- Use structured outputs / tool-use for any machine-readable result — never parse freeform prose.
- Every production call path gets: retry with exponential backoff, rate-limit (429) handling, prompt caching for repeated context (system prompts, documents), and a per-request cost budget with a hard cap.

## RAG pipeline checklist

1. Ingest documents (PDF, HTML, markdown); preserve source metadata per chunk.
2. Chunk: start at ~500-1000 tokens with 10-20% overlap; keep tables and their headers intact in one chunk.
3. Embed chunks with an embedding model.
4. Vector store — local-first: LanceDB or sqlite-vec. Reach for a hosted store only if the user genuinely needs multi-user scale.
5. Retrieve top-k (start k=5); add a rerank step if retrieval hit-rate is weak.
6. Generate answers grounded ONLY in retrieved chunks, with citations back to source chunks.
7. MANDATORY before shipping: build a golden QA set (>=20 questions with known answers), measure retrieval hit-rate and answer faithfulness, and report the numbers exactly as measured.

## Small-model maximization

This is the heart of the skill: near-big-model quality at a fraction of the cost, through architecture — each technique is a real mechanism, not a trick.

- **Decompose.** Split the task so each model call does ONE narrow thing (classify, then extract, then format). Small models fail on broad instructions and succeed on narrow ones.
- **Tight JSON schemas.** A strict schema with enums and required fields constrains the output space and cuts error rates — validation failures become detectable instead of silent.
- **Few-shot from a golden set.** 3-8 real, verified examples in the prompt outperform clever instructions on small models. Pull them from your eval set (keep held-out cases for scoring).
- **Verifier pass.** Add a second small-model call that checks the first output against explicit rules (schema, source-grounding, business constraints). Catches most errors for a fraction of big-model cost.
- **Escalation router.** Try the small model first. Detect low-confidence or failed-validation cases and escalate ONLY those to a bigger model. Typical result: most traffic served cheap, hard cases still handled well.
- **Honest note:** measure the small-vs-big gap with your eval set on YOUR task. Do not assume the gap is small — sometimes it isn't, and the eval is how you find out.

## Evals are mandatory

- No AI feature ships without a golden test set and a measured score. "It looked good on three examples" is not a score.
- Deterministic checks first (exact match, schema validity, citation presence). LLM-as-judge is acceptable for subjective quality — but spot-check the judge against human review on a sample before trusting it.
- Re-run the eval after every prompt or model change; keep scores in a file next to the code.

## Local models (Ollama)

- Use Ollama on Windows for private/offline requirements:

```powershell
winget install Ollama.Ollama
# Pick the current recommended small model from ollama.com/library at build time —
# model names go stale; don't copy one from memory (same rule as the Claude API).
ollama pull <small-model>
ollama run <small-model>
```

- Small local models fit extraction, classification, routing, and simple QA well.
- State limits honestly: weaker reasoning, smaller context, more formatting slips than API models. Compensate with the small-model techniques above, and eval before trusting.

## Safety

- Never fabricate benchmark numbers or eval scores. Report results exactly as measured, including failures.
- User data privacy: default to local-first (Ollama + local vector store) when data is sensitive; tell the user what leaves the machine when using an API.
- Grounded answers only in RAG — if the retrieved context does not contain the answer, say so rather than letting the model guess.
