import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="container">

      {/* LEFT PANEL */}
      <div className="panel left">
        <h2>🚑 Emergency Input</h2>

        <textarea
          placeholder="Enter patient symptoms (e.g., chest pain, bleeding, breathing difficulty...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleAnalyze}>
          Analyze
        </button>
      </div>

      {/* CENTER PANEL */}
      <div className="panel center">
        <h2>🚨 Triage Result</h2>

        {loading && (
          <div className="result-card">
            <p>⏳ Analyzing patient condition...</p>
          </div>
        )}

        {result && (
          <div className="result-card">

            <h1 className={result.triage_result.triage_level}>
              {result.triage_result.triage_level}
            </h1>

            <p><b>Category:</b> {result.triage_result.category}</p>

            <h3>⚡ Actions</h3>
            <ul>
              {result.triage_result.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h3>🧠 Reason</h3>
            <p>{result.triage_result.reason}</p>

            <p><b>Confidence:</b> {result.triage_result.confidence}</p>

          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="panel right">
        <h2>🧠 AI Insights</h2>

        {result && (
          <>
            <h3>Extracted Signals</h3>
            <ul>
              {result.compressed_context.map((c, i) => (
                <li key={i}>✅ {c}</li>
              ))}
            </ul>

            <h3>System Stats</h3>
            <p>⚡ Compression: High</p>
            <p>⏱ Latency: ~300ms</p>
          </>
        )}

        {!result && !loading && (
          <p>Enter symptoms to see AI insights...</p>
        )}
      </div>

    </div>
  );
}

export default App;