import React, { useState } from "react";
import "./App.css";

const SAMPLE_PATIENTS = {
  cardiac: {
    name: "Michael Torres, 62M — Cardiac Emergency",
    symptoms: "Crushing chest pain at rest for 30 minutes, radiating to jaw and left arm, profuse sweating, severe shortness of breath, feels like dying",
    history: `PATIENT: Michael Torres | DOB: 08/14/1962 | AGE: 62M | MRN: 4821093
ALLERGIES: NKDA | INSURANCE: BlueCross PPO | PCP: Dr. Sarah Patel

═══════════════════════════════════════════════════════════════════════════════
CHIEF COMPLAINT: Chest pain x 30 min
═══════════════════════════════════════════════════════════════════════════════

HPI: 62yo M presents to ED c/o acute onset crushing substernal chest pain radiating to L jaw and L arm x 30 min. Pain 9/10, associated with diaphoresis, SOB, nausea. Denies palpitations. Pt states "feels like dying". Onset at rest while watching TV. No relief with rest or antacids. Wife called 911. Pt has significant cardiac hx.

PMHx: HTN (dx 2015), CAD s/p NSTEMI 2019 w/ LAD stent, EF 45% (2021), mild systolic dysfunction, recent stress test 2023 showed moderate ischemia LAD territory. Former smoker (quit 2015, 40 pack-yr hx). Denies DM, denies CVA.

Meds: Aspirin 81mg daily, Clopidogrel 75mg daily, Atorvastatin 40mg, Metoprolol 50mg, Ramipril 5mg, Lisinopril 10mg

Social: Retired accountant. Lives w/ wife. Walks 30min 3x/wk but limited by chest discomfort. Drinks 2-3 beers/wk. Former smoker.

═══════════════════════════════════════════════════════════════════════════════
OBJECTIVE FINDINGS
═══════════════════════════════════════════════════════════════════════════════

VITALS: BP 158/94, HR 102, RR 22, O2 sat 94% RA, Temp 37.1C
PE: Alert, anxious, diaphoretic. Lungs clear bilaterally. Heart: tachycardic, regular, no murmurs. Extremities: no edema, good perfusion.

LABS (ED):
- Troponin I: 0.87 ng/mL (HIGH — normal <0.04)
- CK-MB: 8.2 ng/mL (HIGH)
- BNP: 245 pg/mL (elevated)
- CBC: WBC 11.2, Hgb 13.8, Plt 245
- CMP: K 4.1, Cr 1.1, BUN 18, glucose 118
- Lipid panel: TC 198, LDL 115, HDL 38, TG 156

ECG (ED): ST elevation 2mm in II, III, aVF — INFERIOR STEMI. Reciprocal ST depression in I, aVL.

IMAGING: CXR portable — mild pulmonary edema, no pneumothorax.

═══════════════════════════════════════════════════════════════════════════════
PAST CARDIAC EVENTS & PROCEDURES
═══════════════════════════════════════════════════════════════════════════════

2015-06-10: HTN diagnosed. BP consistently 145-155/90-95. Started lisinopril 10mg.
2017-03-22: Stress test — mild ST depression during exercise. Referred to cardiology.
2018-11-05: Coronary angiography revealed 40% LAD stenosis, 35% RCA stenosis. No intervention.
2019-02-14: NSTEMI — presented w/ chest pain, troponin elevated. Stent placed LAD. Discharged on dual antiplatelet therapy.
2020-08-18: Follow-up angiography — stent patent, no restenosis.
2021-12-03: EF 45% (mild systolic dysfunction). Started ramipril 5mg.
2023-05-20: Stress test — moderate ischemia LAD territory. Increased metoprolol dose.

═══════════════════════════════════════════════════════════════════════════════
MISCELLANEOUS NOTES (OLDER, LESS RELEVANT)
═══════════════════════════════════════════════════════════════════════════════

2009-03-12: Routine dental cleaning. No cavities.
2010-07-15: Root canal tooth #14. Successful.
2014-11-08: Eye exam. Mild presbyopia. Prescribed reading glasses.
2016-04-30: Cataract screening — negative.
2018-06-14: Routine eye exam — vision stable.
2022-01-19: Dental cleaning. Gum health good.

ASSESSMENT: 62yo M w/ significant cardiac hx presenting w/ acute inferior STEMI. Hemodynamically unstable. Requires urgent cardiac catheterization and revascularization.

PLAN: Activate cath lab. Dual antiplatelet therapy (already on aspirin + clopidogrel). Heparin bolus + infusion. Nitroglycerin SL. Oxygen. Cardiac monitoring. Prepare for emergent PCI.`,
  },
  neuro: {
    name: "Priya Sharma, 45F — Neurological Emergency",
    symptoms: "Sudden right-sided facial drooping, right arm weakness, slurred speech, started 20 minutes ago, still ongoing",
    history: `PATIENT: Priya Sharma | DOB: 11/03/1979 | AGE: 45F | MRN: 7734821
ALLERGIES: Penicillin (rash), Sulfonamides (GI upset) | INSURANCE: Aetna HMO | PCP: Dr. James Wilson

═══════════════════════════════════════════════════════════════════════════════
CHIEF COMPLAINT: Facial drooping, arm weakness, slurred speech x 20 min
═══════════════════════════════════════════════════════════════════════════════

HPI: 45yo F presents to ED w/ acute onset R facial drooping, R arm weakness, slurred speech x 20 min. Symptoms started suddenly while at work. Pt was sitting at desk when she noticed difficulty speaking and weakness in R arm. Wife brought her to ED. Denies headache, denies vision changes, denies vertigo. Last known well: 20 min ago. Pt has hx of migraines and prior TIA 2018.

PMHx: Type 2 DM (dx 2008, HbA1c 7.3%), HTN (dx 2010, BP usually 138/88), Migraines (2-3/mo, on propranolol prophylaxis), Prior TIA 2018 (L arm weakness x 15 min, fully resolved, on aspirin since then). Denies CVA, denies seizures.

Meds: Aspirin 81mg daily, Metformin 1000mg BID, Amlodipine 5mg, Lisinopril 10mg, Propranolol 40mg, Atorvastatin 20mg, Vitamin D 1000 IU daily

Social: Works as accountant. Lives w/ husband and 2 kids. Denies smoking, denies alcohol. Exercises 3x/wk.

═══════════════════════════════════════════════════════════════════════════════
OBJECTIVE FINDINGS
═══════════════════════════════════════════════════════════════════════════════

VITALS: BP 142/88, HR 88, RR 18, O2 sat 98% RA, Temp 36.9C
NEURO EXAM: Alert, oriented x3. Speech slurred. R facial droop (CN VII). R arm drift (4/5 strength). L side intact. Cranial nerves II-XII otherwise intact. Gait not assessed (acute setting).

LABS (ED):
- Glucose: 156 mg/dL (elevated, consistent w/ DM)
- CBC: WBC 9.2, Hgb 12.1, Plt 198
- CMP: K 4.0, Cr 0.9, BUN 16, glucose 156
- PT/INR: 1.0 (normal)
- Troponin: negative

IMAGING: CT head (non-contrast) — NO acute intracranial hemorrhage. No mass. No acute infarct visible yet (early window).
MRI brain pending — will assess for acute ischemic stroke.

CAROTID ULTRASOUND (prior 2021): Mild atherosclerotic changes noted. No significant stenosis.

═══════════════════════════════════════════════════════════════════════════════
NEUROLOGICAL HISTORY
═══════════════════════════════════════════════════════════════════════════════

2010-05-12: First migraine episode. Diagnosed w/ episodic migraines. Frequency 2-3/mo.
2012-08-20: MRI brain for recurrent headaches — NO abnormalities.
2015-03-15: Started propranolol 40mg for migraine prophylaxis. Reduced frequency to 1-2/mo.
2018-11-22: TIA — brief L arm weakness x 15 min, fully resolved. MRI showed no acute stroke. Carotid US normal. Started aspirin 81mg daily.
2019-06-10: Neurology follow-up. Advised strict HTN and DM control. EEG normal.
2023-09-18: Recent MRI for persistent headaches — small white matter changes consistent w/ age. No acute findings.

═══════════════════════════════════════════════════════════════════════════════
METABOLIC & ENDOCRINE HISTORY
═══════════════════════════════════════════════════════════════════════════════

2008-04-22: Type 2 DM diagnosed. HbA1c 8.2%. Started metformin 500mg.
2010-12-05: HTN diagnosed. BP 148/92. Started amlodipine 5mg.
2015-07-18: DM control improved. HbA1c 7.1%. Increased metformin to 1000mg.
2020-03-10: Added lisinopril 10mg for BP control and renal protection.
2022-11-30: Recent labs — HbA1c 7.3%, BP 138/88. Stable on current regimen.

═══════════════════════════════════════════════════════════════════════════════
MISCELLANEOUS NOTES (OLDER, LESS RELEVANT)
═══════════════════════════════════════════════════════════════════════════════

2012-04-15: Annual gyn exam. Normal Pap smear.
2014-08-22: Mammogram — no abnormalities.
2016-03-10: Routine gyn exam. Menopausal symptoms discussed.
2018-09-05: Dental cleaning. Gum health good.
2020-01-20: Eye exam — vision stable.
2023-05-12: Annual physical — weight stable.

ASSESSMENT: 45yo F w/ hx of DM, HTN, prior TIA presenting w/ acute R-sided weakness, facial droop, slurred speech x 20 min. Highly suspicious for acute ischemic stroke. Time-critical presentation — within thrombolytic window.

PLAN: Stat MRI brain. Neurology consult. Prepare for possible tPA or thrombectomy. Aspirin already on board. Cardiac monitoring. Strict BP management.`,
  },
  allergy: {
    name: "David Kim, 58M — Cardiac with Aspirin Anaphylaxis",
    symptoms: "Crushing chest pain radiating to left arm, shortness of breath, sweating, feels like a heart attack",
    history: `PATIENT: David Kim | DOB: 04/22/1958 | AGE: 58M | MRN: 9921034
ALLERGIES: *** ASPIRIN — ANAPHYLAXIS (2019 ER admission, epinephrine given) *** | Ibuprofen (GI bleed 2021) | Contrast dye (hives 2020)
INSURANCE: Cigna PPO | PCP: Dr. Robert Chen

═══════════════════════════════════════════════════════════════════════════════
CHIEF COMPLAINT: Chest pain x 30 min
═══════════════════════════════════════════════════════════════════════════════

HPI: 58yo M presents w/ acute onset crushing substernal chest pain radiating to L arm x 30 min. Pain 8/10. Associated w/ SOB, diaphoresis, nausea. Onset at rest. Wife called 911. Pt has extensive cardiac hx including prior NSTEMI 2019 w/ LAD stent. *** CRITICAL ALLERGY: ASPIRIN ANAPHYLAXIS — DO NOT GIVE ASPIRIN ***

PMHx: HTN (dx 2015), CAD s/p NSTEMI 2019 w/ LAD stent (aspirin allergy documented in chart — used clopidogrel monotherapy instead), EF 48% (2021, mild dysfunction), recent stress test 2023 showed moderate ischemia LAD. Former smoker (quit 2015, 40 pack-yr hx). Denies DM.

Meds: *** CLOPIDOGREL 75mg daily (NOT aspirin) ***, Atorvastatin 40mg, Metoprolol 50mg, Ramipril 5mg, Lisinopril 10mg. Pain mgmt: Acetaminophen 500mg (safe), Tramadol if needed.

Social: Retired. Lives w/ wife. Limited exercise due to chest discomfort. Denies smoking, denies alcohol.

═══════════════════════════════════════════════════════════════════════════════
OBJECTIVE FINDINGS
═══════════════════════════════════════════════════════════════════════════════

VITALS: BP 156/92, HR 105, RR 21, O2 sat 95% RA, Temp 37.0C
PE: Alert, anxious, diaphoretic. Lungs clear. Heart: tachycardic, regular. Extremities: no edema.

LABS (ED):
- Troponin I: 0.92 ng/mL (HIGH — normal <0.04)
- CK-MB: 9.1 ng/mL (HIGH)
- BNP: 268 pg/mL (elevated)
- CBC: WBC 10.8, Hgb 13.5, Plt 242
- CMP: K 4.2, Cr 1.0, BUN 17, glucose 115
- Lipid panel: TC 195, LDL 110, HDL 40, TG 150

ECG (ED): ST elevation 2mm in II, III, aVF — INFERIOR STEMI. Reciprocal ST depression in I, aVL.

CXR: Mild pulmonary edema.

═══════════════════════════════════════════════════════════════════════════════
CRITICAL ALLERGY HISTORY
═══════════════════════════════════════════════════════════════════════════════

2019-02-14: ASPIRIN ANAPHYLAXIS — Pt took aspirin for chest pain. Developed throat swelling, difficulty breathing, rash, hypotension within 15 min. Required ER admission, epinephrine IM given, hospitalized 2 days. Allergy documented in all systems. ABSOLUTE CONTRAINDICATION.

2021-03-10: Ibuprofen GI bleed — Pt took ibuprofen for back pain. Developed melena, required transfusion. AVOID ALL NSAIDs.

2020-06-15: Contrast dye reaction — During cardiac catheterization (non-contrast imaging used instead), pt developed urticarial rash. Use non-contrast imaging when possible.

═══════════════════════════════════════════════════════════════════════════════
CARDIOVASCULAR HISTORY
═══════════════════════════════════════════════════════════════════════════════

2015-06-10: HTN diagnosed. BP 150/95. Started lisinopril 10mg.
2017-03-22: Stress test — mild ST changes. Referred to cardiology.
2018-11-05: Coronary angiography (non-contrast) — 50% LAD stenosis. No intervention at that time.
2019-02-14: NSTEMI — chest pain, troponin elevated. Stent placed LAD. *** ASPIRIN ALLERGY DOCUMENTED — used clopidogrel monotherapy instead of dual antiplatelet therapy ***
2020-08-18: Follow-up angiography — stent patent, no restenosis. Continued clopidogrel 75mg daily.
2021-12-03: EF 48% (mild systolic dysfunction). Added ramipril 5mg.
2023-05-20: Recent stress test — moderate ischemia LAD territory. Increased metoprolol dose.

═══════════════════════════════════════════════════════════════════════════════
MISCELLANEOUS NOTES (OLDER, LESS RELEVANT)
═══════════════════════════════════════════════════════════════════════════════

2009-03-12: Routine dental cleaning.
2010-07-15: Root canal tooth #14.
2014-11-08: Eye exam — mild presbyopia.
2016-04-30: Cataract screening — negative.
2018-06-14: Routine eye exam — vision stable.

ASSESSMENT: 58yo M w/ extensive cardiac hx, prior NSTEMI 2019 s/p LAD stent, presenting w/ acute inferior STEMI. *** CRITICAL: ASPIRIN ANAPHYLAXIS — DO NOT ADMINISTER ASPIRIN. Use clopidogrel (already on board) + alternative antiplatelet/anticoagulation strategy. ***

PLAN: Activate cath lab. *** NO ASPIRIN — use clopidogrel (already on 75mg daily) + heparin + nitroglycerin. Consider dipyridamole or other alternatives. *** Oxygen. Cardiac monitoring. Prepare for emergent PCI. Cardiology consult.`,
  },
};

function App() {
  const [selectedPatient, setSelectedPatient] = useState("cardiac");
  const [query, setQuery] = useState("");
  const [patientHistory, setPatientHistory] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoadPatient = (patientKey) => {
    const patient = SAMPLE_PATIENTS[patientKey];
    setSelectedPatient(patientKey);
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
        headers: {
          "Content-Type": "application/json",
        },
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

        <div className="sample-patients">
          <label>Load Sample Patient:</label>
          <div className="button-group">
            {Object.entries(SAMPLE_PATIENTS).map(([key, patient]) => (
              <button
                key={key}
                className={`patient-btn ${selectedPatient === key ? "active" : ""}`}
                onClick={() => handleLoadPatient(key)}
              >
                {patient.name.split(" — ")[0]}
              </button>
            ))}
          </div>
        </div>

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
              <pre className="pruned-history">
                {result.pruned_history}
              </pre>
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
