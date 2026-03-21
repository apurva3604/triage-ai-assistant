import logging
import os

import httpx

SCALEDOWN_API_URL = "https://api.scaledown.xyz/compress/raw/"
TIMEOUT_SECONDS = 10.0


def prune_context(query: str, patient_history: str) -> dict:
    """
    Calls ScaleDown API to prune patient_history using query as the relevance signal.

    Returns:
        {
            "pruned_history": str,
            "input_tokens": int,
            "output_tokens": int
        }
    """
    api_key = os.environ.get("SCALEDOWN_API_KEY", "")

    try:
        response = httpx.post(
            SCALEDOWN_API_URL,
            headers={
                "x-api-key": api_key,
                "Content-Type": "application/json",
            },
            json={
                "context": patient_history,
                "prompt": query,
                "scaledown": {"rate": "auto"},
            },
            timeout=TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        data = response.json()
        results = data["results"]
        return {
            "pruned_history": results["compressed_prompt"],
            "input_tokens": data["total_original_tokens"],
            "output_tokens": data["total_compressed_tokens"],
        }
    except httpx.TimeoutException as e:
        logging.warning(f"ScaleDown API timed out: {e}")
    except httpx.HTTPStatusError as e:
        logging.warning(f"ScaleDown API returned non-2xx status {e.response.status_code}: {e}")
    except Exception as e:
        logging.warning(f"ScaleDown API call failed: {e}")

    # Fallback: return original patient_history unmodified
    token_count = len(patient_history.split())
    return {
        "pruned_history": patient_history,
        "input_tokens": token_count,
        "output_tokens": token_count,
    }
