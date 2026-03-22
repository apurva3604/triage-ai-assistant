import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [patientHistory, setPatientHistory] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load sample patients from JSON on mount
  useEffect(() => {
    fetch("/sample_patients.json")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((err) => console.error("Failed to load sample patients:", err));
  }, []);

  const handleLoadPatient = (patient) => {
    setSelectedId(patient.id);
    setQuery(patient.symptoms);
    setPatientHistory(patient.history);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!query) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, patient_history: patientHistory }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to backend. Ensure it's running on http://127.0.0.1:8000");
    }

    setLoading(false);
  };

  return (
    <div className="container">

      {/* LEFT PANEL */}
      <div className="panel left">
        <h2>🚑 Emergency Input</h2>

        {patients.length > 0 && (
          <div className="sample-patients">
            <label>Load Sample Patient:</label>
            <div className="button-group">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  className={`patient-btn ${selectedId === patient.id ? "active" : ""}`}
                  onClick={() => handleLoadPatient(patient)}
                >
                  {patient.name.split(" — ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-section">
          <label>Patient Symptoms</label>
          <textarea
            placeholder="Enter patient symptoms (e.g., chest pain, bleeding, breathing difficulty...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <label>Patient History</label>
          <textarea
            placeholder="Paste patient history (optional)..."
            value={patientHistory}
            onChange={(e) => setPatientHistory(e.target.value)}
            className="history-textarea"
          />

          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? "⏳ Analyzing..." : "🔍 Analyze"}
          </button>
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="panel center">
        <h2>🚨 Triage Result</h2>

        {loading && (
          <div className="result-card">
            <p className="loading-text">⏳ Analyzing patient condition...</p>
          </div>
        )}

        {result && (
          <div className="result-card">
            <h1 className={`triage-level ${result.triage_result.triage_level}`}>
              {result.triage_result.triage_level}
            </h1>

            <div className="result-meta">
              <p><b>Category:</b> {result.triage_result.category}</p>
              <p><b>Confidence:</b> {result.triage_result.confidence}</p>
            </div>

            <h3>⚡ Recommended Actions</h3>
            <ul className="actions-list">
              {result.triage_result.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h3>🧠 Clinical Reasoning</h3>
            <p className="reason-text">{result.triage_result.reason}</p>
          </div>
        )}

        {!result && !loading && (
          <p className="placeholder-text">Load a sample patient or enter symptoms to begin triage analysis...</p>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="panel right">
        <h2>🧠 AI Insights</h2>

        {result && (
          <>
            <div className="insights-section">
              <h3>📋 Pruned History</h3>
              <pre className="pruned-history">{result.pruned_history}</pre>
            </div>

            <div className="insights-section stats">
              <h3>⚙️ System Stats</h3>
              <div className="stat-item">
                <span>Compression Ratio:</span>
                <strong>{result.compression_ratio_pct !== null ? `${result.compression_ratio_pct}%` : "N/A"}</strong>
              </div>
              <div className="stat-item">
                <span>Reasoning Latency:</span>
                <strong style={{ color: result.reasoning_latency_ms > 500 ? "#ef4444" : "#22c55e" }}>
                  {result.reasoning_latency_ms}ms
                </strong>
              </div>
              <div className="stat-item">
                <span>End-to-End Latency:</span>
                <strong>{result.end_to_end_latency_ms}ms</strong>
              </div>
            </div>
          </>
        )}

        {!result && !loading && (
          <p className="placeholder-text">System stats will appear here after analysis...</p>
        )}
      </div>

    </div>
  );
}

export default App;
