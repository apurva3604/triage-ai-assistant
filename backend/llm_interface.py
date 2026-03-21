import os
import json
import re
import logging
from groq import Groq

logger = logging.getLogger(__name__)

REQUIRED_KEYS = {"triage_level", "category", "actions", "reason", "confidence"}

SYSTEM_MESSAGE = """You are an emergency medical triage assistant. Given patient symptoms, pruned patient history, and relevant triage protocols, return a JSON triage assessment.

Respond ONLY with valid JSON in this exact structure:
{
  "triage_level": "CRITICAL" | "URGENT" | "STABLE",
  "category": "<medical category, e.g. CARDIAC, NEUROLOGICAL, RESPIRATORY, TRAUMA, GENERAL>",
  "actions": ["<action1>", "<action2>", "<action3>"],
  "reason": "<natural language explanation>",
  "confidence": "High" | "Medium" | "Low"
}"""

FALLBACK_RESPONSE = {
    "triage_level": "STABLE",
    "category": "GENERAL",
    "actions": ["Manual assessment required"],
    "reason": "LLM reasoning unavailable — manual assessment required",
    "confidence": "Low",
}

RETRY_INSTRUCTION = "\n\nYour previous response was not valid JSON. Respond ONLY with the JSON object, no markdown, no explanation."


def _build_user_message(query: str, pruned_history: str, protocol_context: list[str]) -> str:
    protocols_text = "\n\n".join(protocol_context)
    return f"""Patient symptoms:
{query}

Pruned patient history:
{pruned_history}

Relevant triage protocols:
{protocols_text}"""


def _strip_markdown_fences(text: str) -> str:
    text = text.strip()
    # Remove ```json ... ``` or ``` ... ```
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _parse_response(content: str) -> dict | None:
    try:
        cleaned = _strip_markdown_fences(content)
        parsed = json.loads(cleaned)
        if not REQUIRED_KEYS.issubset(parsed.keys()):
            logger.warning("LLM response missing required keys: %s", parsed.keys())
            return None
        return parsed
    except (json.JSONDecodeError, AttributeError) as e:
        logger.warning("Failed to parse LLM response: %s", e)
        return None


def call_llm(query: str, pruned_history: str, protocol_context: list[str]) -> dict:
    """
    Builds a prompt from all three inputs and calls the LLM.

    Returns:
        {
            "triage_level": "CRITICAL" | "URGENT" | "STABLE",
            "category": str,
            "actions": list[str],
            "reason": str,
            "confidence": "High" | "Medium" | "Low"
        }
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    user_message = _build_user_message(query, pruned_history, protocol_context)

    # First attempt
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": user_message},
            ],
        )
        content = response.choices[0].message.content
        logger.debug("LLM raw response: %s", content)
        result = _parse_response(content)
        if result is not None:
            return result
    except Exception as e:
        logger.error("LLM call failed on first attempt: %s", e, exc_info=True)

    # Retry once with JSON formatting instruction
    retry_user_message = user_message + RETRY_INSTRUCTION
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": retry_user_message},
            ],
        )
        content = response.choices[0].message.content
        logger.debug("LLM retry raw response: %s", content)
        result = _parse_response(content)
        if result is not None:
            return result
    except Exception as e:
        logger.error("LLM call failed on retry: %s", e, exc_info=True)

    logger.error("LLM failed after retry — returning fallback response")
    return FALLBACK_RESPONSE
