# Triage AI Assistant

An AI-powered emergency medical triage system built for the ScaleDown Hackathon. It compresses messy patient histories, retrieves relevant medical protocols, and uses an LLM to produce safe, structured triage decisions in real time.

---

## The Problem

Emergency departments receive patients with 10-15 years of EHR records — dental cleanings, eye exams, old lab results — all mixed in with the one critical piece of information that matters right now. Sending that raw record to an LLM wastes tokens, buries the signal, and risks hallucinated recommendations. The challenge: get an LLM to reason safely over a messy patient record and a library of disaster protocols without exceeding token limits or ignoring critical flags.

---

## What We Built

A three-stage pipeline:

```
Messy Patient EHR (500-800 words)
    ↓
ScaleDown API — compresses history, keeps clinically relevant signals
    ↓
ChromaDB — retrieves top-5 relevant triage protocols by symptom similarity
    ↓
Groq LLM (llama-3.1-8b-instant) — reasons over all three inputs
    ↓
{ triage_level, category, actions, reason, confidence }
```

## Features

- Compresses multi-year messy EHR records to 7-33% of original size using ScaleDown, stripping irrelevant noise while preserving critical history.
- Retrieves verified triage protocols from a ChromaDB vector store to ground LLM recommendations and prevent hallucination.
- Produces structured triage decisions (CRITICAL / URGENT / STABLE) with category, recommended actions, clinical reasoning, and confidence level.
- Cross-references patient allergies from compressed history against protocol recommendations automatically.
- Returns real-time metrics: compression ratio, reasoning latency, and end-to-end latency per request.
- Includes 3 sample patients with realistic messy SOAP-note-style EHR records for one-click demo.
- Sample patients are data-driven — loaded from `data/sample_patients.json`, no hardcoding in the UI.

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- [Groq API key](https://console.groq.com) (free tier)
- [ScaleDown API key](https://scaledown.xyz)

---

## Setup & Running

### 1. Clone the repo

```bash
git clone https://github.com/apurva3604/triage-ai-assistant.git
cd triage-ai-assistant
```

### 2. Create `.env` in the project root

```
GROQ_API_KEY=your_groq_api_key_here
SCALEDOWN_API_KEY=your_scaledown_api_key_here
```

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
```

### 4. Frontend

```bash
cd frontend
npm install
```

### 5. Run (two terminals)

```bash
# Terminal 1
cd backend
uvicorn main:app --reload

# Terminal 2
cd frontend
npm start
```

Backend: `http://127.0.0.1:8000` — Frontend: `http://localhost:3000`

---

## Usage

1. Open `http://localhost:3000`
2. Click a sample patient button to auto-populate symptoms and history
3. Click **Analyze**
4. View triage decision in the center panel, compressed history and stats on the right

To add more sample patients, edit `data/sample_patients.json` and copy it to `frontend/public/sample_patients.json`.

---

## API

### `POST /triage`

```json
// Request
{ "query": "chest pain radiating to left arm", "patient_history": "..." }

// Response
{
  "pruned_history": "...",
  "triage_result": { "triage_level": "CRITICAL", "category": "CARDIAC", "actions": ["..."], "reason": "...", "confidence": "High" },
  "reasoning_latency_ms": 1500.0,
  "end_to_end_latency_ms": 5000.0,
  "compression_ratio_pct": 9.5
}
```

---

## Project Structure

```
triage-ai-assistant/
├── backend/
│   ├── main.py              # FastAPI app, pipeline orchestration
│   ├── context_pruner.py    # ScaleDown API integration
│   ├── llm_interface.py     # Groq LLM call, JSON parsing, retry logic
│   ├── triage_engine.py     # Thin delegation to LLM
│   ├── vector_store.py      # ChromaDB build + query
│   └── requirements.txt
├── frontend/
│   ├── src/App.js           # React UI
│   └── public/
│       └── sample_patients.json
├── data/
│   ├── sample_patients.json      # Source of truth for sample patients
│   └── medical_datasets/         # Medical QA datasets for ChromaDB
├── chroma_db/               # Persisted vector store (auto-built on first run)
└── .env                     # API keys (not committed)
```

## Known Limitations

- End-to-end latency is ~5s (ScaleDown ~2-3s + Groq ~1.5s on free tier)
- Protocol context truncated to 300 chars/doc to stay within Groq 6000 token/min free tier limit
