from llm_interface import call_llm

def generate_triage(query: str, pruned_history: str, protocol_context: list[str]) -> dict:
    return call_llm(query, pruned_history, protocol_context)
