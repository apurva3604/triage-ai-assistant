import pandas as pd
import os

DATA_FOLDER = "../data/medical_datasets"

def load_datasets():
    documents = []

    for file in os.listdir(DATA_FOLDER):
        if file.endswith(".csv"):

            path = os.path.join(DATA_FOLDER, file)
            print("Loading:", path)

            try:
                df = pd.read_csv(path, encoding="utf-8", engine="python", on_bad_lines="skip")
            except:
                df = pd.read_csv(path, encoding="latin1", engine="python", on_bad_lines="skip")

            df = df.fillna("")

            for _, row in df.iterrows():
                text = " ".join(str(v) for v in row.values if str(v).strip() != "")
                if len(text) > 5:
                    documents.append(text)

    print("Documents loaded:", len(documents))
    return documents