# Triage System — Test Results

Date: March 21, 2026

## Pipeline Overview

```
Symptoms + Patient History
    → ScaleDown API (compress history, keep clinically relevant signals)
    → ChromaDB (retrieve top-5 triage protocols by symptom similarity)
    → Groq LLM (llama-3.1-8b-instant, reasons over all 3 inputs)
    → Structured triage decision
```

---

## 1. Multi-Patient Test

4 patients across different medical categories. All returned correct triage levels and categories.

| Patient | Symptoms | Level | Category | Confidence | Compression | Reasoning Latency |
|---------|----------|-------|----------|------------|-------------|-------------------|
| 58M Cardiac | Chest pain radiating to left arm, SOB, sweating, nausea | CRITICAL | CARDIAC | High | 9.5% | 1848ms |
| 34F Neurological | Sudden severe headache, neck stiffness, photophobia, vomiting | CRITICAL | NEUROLOGICAL | High | 9.7% | 1450ms |
| 67M Respiratory | Difficulty breathing, wheezing, hemoptysis, fever 39.2C, SpO2 88% | CRITICAL | RESPIRATORY | High | 8.3% | 1428ms |
| 22M Trauma (no history) | Hit by car, LOC 2min, confused, head bleeding, broken leg | URGENT | TRAUMA | High | N/A | 1487ms |

Key observations:
- All categories correctly identified
- Trauma patient with no history correctly returned compression N/A
- Reasoning latency consistent at ~1400-1850ms

---

## 2. Real-World Test (Detailed Multi-Year Histories)

2 patients with 500-800 word histories spanning 15+ years, including irrelevant noise (dental, eye exams, dermatology, OB/GYN).

### Michael Torres, 62M — Cardiac Emergency
- History: 774 words, 15 years of records
- Symptoms: Crushing chest pain at rest 30min, radiating to jaw and left arm, profuse sweating, severe SOB
- Result: CRITICAL / CARDIAC / High
- Compression: 7.9% (774 words → ~61 words kept)
- Actions: Administer aspirin (if not allergic), call ambulance, prepare for emergency angiography/PCI
- Latency: 1876ms reasoning / 6158ms end-to-end

### Priya Sharma, 45F — Neurological Emergency
- History: 525 words, 12 years of records
- Symptoms: Sudden right-sided facial drooping, right arm weakness, slurred speech, 20min ago, ongoing
- Result: CRITICAL / NEUROLOGICAL / High
- Compression: 9.7% (525 words → ~51 words kept)
- Actions: Summon neurologist/stroke specialist, administer antiplatelet agents, cardiac monitoring
- Latency: 1449ms reasoning / 4543ms end-to-end

Key observations:
- ScaleDown aggressively compressed histories (7-10%), stripping dental, eye, dermatology noise
- Clinically relevant sections (cardiovascular history, neurological history) preserved
- LLM produced medically appropriate actions based on both history and protocols

---

## 3. Allergy Sync Test

Tests whether the LLM cross-references patient allergies from pruned history against standard disaster protocols.

### CASE 1: Cardiac Patient with Aspirin Anaphylaxis
- Patient: David Kim, 58M — documented aspirin anaphylaxis (2019 ER admission)
- Symptoms: Crushing chest pain, radiating to left arm, SOB, sweating
- Standard cardiac protocol: Administer aspirin
- Result: CRITICAL / CARDIAC / High
- Actions: Administer nitroglycerin, prepare ECG/cardiac enzymes, alert cardiology team
- Compression: 23.3%
- **ALLERGY SYNC: PASS — LLM avoided aspirin entirely, substituted nitroglycerin**

### CASE 2: Anaphylaxis Patient with Epinephrine Contraindication
- Patient: Sarah Okonkwo, 34F — epinephrine causes hypertensive crisis (2018 ICU admission)
- Symptoms: Severe allergic reaction, throat swelling, hives, BP dropping, difficulty breathing
- Standard anaphylaxis protocol: Administer epinephrine
- Result: CRITICAL / CARDIAC-ANAPHYLACTIC / High
- Actions: Administer diphenhydramine IV, administer methylprednisolone IV, supportive care
- Compression: 33.3%
- **ALLERGY SYNC: PASS — LLM avoided epinephrine entirely, used exact alternative protocol from history**

Key observations:
- ScaleDown preserved allergy sections as high-signal content (higher compression ratios: 23-33%)
- LLM correctly cross-referenced pruned history allergies against protocol recommendations
- Both cases produced safe, patient-specific alternatives instead of standard protocol drugs
- This demonstrates the core value: context pruning + protocol retrieval working in sync

---

## Performance Summary

| Metric | Value |
|--------|-------|
| Reasoning latency (avg) | ~1500ms |
| End-to-end latency (avg) | ~5000ms |
| Compression ratio (avg) | 7-33% depending on history relevance density |
| Triage accuracy | 100% correct categories across all test cases |
| Allergy sync | 2/2 PASS — no unsafe drug recommendations |

## Known Limitations

- Reasoning latency exceeds 500ms target (Groq free tier from India adds network latency)
- ScaleDown compression is probabilistic — allergy lines could theoretically be pruned in edge cases
- Protocol context truncated to 300 chars/doc to stay within Groq 6000 token/min free tier limit
