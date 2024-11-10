import faiss
import openai
from sentence_transformers import SentenceTransformer
import numpy as np

# Load a pre-trained embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# List of file paths for tourism data
file_paths = ["Top-Indian-Places-to-Visit.txt", "indian_food.txt", "goibibo_hotels.txt"]

# Load and combine documents from all files
docs = []
for file_path in file_paths:
    with open(file_path, "r") as f:
        docs.extend(f.readlines())  # Add lines from each file to the docs list

# Generate embeddings for all documents
doc_embeddings = embedder.encode(docs)

# Initialize FAISS index
dimension = doc_embeddings.shape[1]  # Dimensionality of the embeddings
index = faiss.IndexFlatL2(dimension)
index.add(np.array(doc_embeddings))

# Save FAISS index for later use
faiss.write_index(index, "tourism_index.faiss")
