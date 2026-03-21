import time
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env", override=True)

from vector_store import build_vector_database, query_database
from context_pruner import prune_context
from triage_engine import generate_triage

app = FastAPI()

#  VERY IMPORTANT (for React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Build DB only once
build_vector_database()


# Health check
@app.get("/")
def home():
    return {"message": "Triage API is running", "version": "v2-llm-aligned"}


# MAIN ENDPOINT (CONNECTED TO UI)
@app.post("/triage")
async def triage(request: Request):
    t0 = time.perf_counter()

    body = await request.json()
    query = body.get("query", "").strip()
    patient_history = body.get("patient_history", "")

    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    # Step 1: Prune patient history via ScaleDown
    pruned = prune_context(query, patient_history)
    pruned_history = pruned["pruned_history"]
    input_tokens = pruned["input_tokens"]
    output_tokens = pruned["output_tokens"]

    # Step 2: Retrieve protocol context from ChromaDB using symptoms
    results = query_database(query)
    protocol_context = [doc[:300] for doc in results["documents"][0]]

    # Step 3: LLM triage over all three inputs
    t1 = time.perf_counter()
    decision = generate_triage(query, pruned_history, protocol_context)
    t2 = time.perf_counter()

    # Step 4: Metrics
    reasoning_latency_ms = round((t2 - t1) * 1000, 1)
    end_to_end_latency_ms = round((t2 - t0) * 1000, 1)

    if patient_history and input_tokens > 0:
        compression_ratio_pct = round((output_tokens / input_tokens * 100), 1)
    else:
        compression_ratio_pct = None

    if reasoning_latency_ms > 500:
        logging.warning(
            f"High reasoning latency: {reasoning_latency_ms}ms | "
            f"query='{query}' | pruned_tokens={output_tokens}"
        )

    return {
        "query": query,
        "pruned_history": pruned_history,
        "triage_result": decision,
        "reasoning_latency_ms": reasoning_latency_ms,
        "end_to_end_latency_ms": end_to_end_latency_ms,
        "compression_ratio_pct": compression_ratio_pct,
    }
