from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(documents):
    return model.encode(documents, show_progress_bar=True)