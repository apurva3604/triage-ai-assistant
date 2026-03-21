# Triage AI Assistant

AI-powered emergency triage system that combines context compression (ScaleDown), medical knowledge retrieval (ChromaDB), and LLM reasoning (Groq) to produce safe, patient-specific triage decisions.

## Prerequisites

- Python 3.10+
- Node.js 18+
- API keys for [Groq](https://console.groq.com) and [ScaleDown](https://scaledown.ai)

## Setup

### 1. Clone and create environment file

```bash
git clone <repo-url>
cd triage-ai-assistant
```

Create a `.env` file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
SCALEDOWN_API_KEY=your_scaledown_api_key_here
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

## Running

### Start the backend (Terminal 1)

```bash
cd backend
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

### Start the frontend (Terminal 2)

```bash
cd frontend
npm start
```

Frontend runs at `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter patient symptoms in the first textarea
3. Optionally paste patient medical history in the second textarea
4. Click "Analyze"
5. View triage result (center panel) and AI insights with compression/latency stats (right panel)

## Architecture

```
React UI → FastAPI backend
                ├── ScaleDown API (compresses patient history)
                ├── ChromaDB (retrieves relevant triage protocols)
                └── Groq LLM (reasons over symptoms + pruned history + protocols)
```

## API

### POST /triage

Request:
```json
{
  "query": "chest pain radiating to left arm",
  "patient_history": "optional multi-paragraph patient history"
}
```

Response:
```json
{
  "query": "...",
  "pruned_history": "...",
  "triage_result": {
    "triage_level": "CRITICAL | URGENT | STABLE",
    "category": "CARDIAC | NEUROLOGICAL | RESPIRATORY | TRAUMA | GENERAL",
    "actions": ["..."],
    "reason": "...",
    "confidence": "High | Medium | Low"
  },
  "reasoning_latency_ms": 1500.0,
  "end_to_end_latency_ms": 5000.0,
  "compression_ratio_pct": 9.5
}
```
