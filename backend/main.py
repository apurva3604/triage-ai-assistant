from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

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

# ✅ Build DB only once
build_vector_database()


# 🔹 Health check (optional)
@app.get("/")
def home():
    return {"message": "Triage API is running"}


# 🔥 MAIN ENDPOINT (CONNECTED TO UI)
@app.post("/triage")
async def triage(request: Request):

    body = await request.json()
    query = body.get("query")

    if not query:
        return {"error": "Query is required"}

    # 🔹 Step 1: Retrieve docs
    results = query_database(query)
    docs = results["documents"][0]

    # 🔹 Step 2: Context pruning
    compressed = prune_context(query, docs)

    # 🔹 Step 3: Triage decision
    decision = generate_triage(compressed)

    return {
        "query": query,
        "compressed_context": compressed,
        "triage_result": decision
    }