import chromadb

from dataset_loader import load_datasets
from embeddings import create_embeddings

# ✅ correct persistent client
client = chromadb.PersistentClient(path="../chroma_db")

collection = client.get_or_create_collection(name="medical_knowledge")


def build_vector_database():

    # ✅ check if already exists
    if collection.count() > 0:
        print("✅ Vector DB already exists. Skipping rebuild.")
        return

    documents = load_datasets()

    print("Creating embeddings...")
    embeddings = create_embeddings(documents)

    ids = [str(i) for i in range(len(documents))]

    BATCH_SIZE = 5000

    for i in range(0, len(documents), BATCH_SIZE):

        print(f"Inserting batch {i} to {i+BATCH_SIZE}")

        collection.add(
            documents=documents[i:i+BATCH_SIZE],
            embeddings=embeddings[i:i+BATCH_SIZE],
            ids=ids[i:i+BATCH_SIZE]
        )

    print("✅ Vector database built with", len(documents), "documents")


def query_database(query_text):

    results = collection.query(
        query_texts=[query_text],
        n_results=5
    )

    return results