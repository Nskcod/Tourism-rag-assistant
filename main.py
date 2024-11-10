from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load pre-trained model and FAISS index
embedder = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index("tourism_index.faiss")

# Set up OpenAI API key

groq_client = Groq(api_key="YOUR_GROQ_API_KEY")

# Load tourism data (assuming docs is a global variable containing the indexed documents)
# List of file paths for tourism data
file_paths = ["Top-Indian-Places-to-Visit.txt", "indian_food.txt", "goibibo_hotels.txt"]

# Load and combine documents from all files
docs = []
for file_path in file_paths:
    with open(file_path, "r") as f:
        docs.extend(f.readlines())  # Add lines from each file to the docs list

# Define the Pydantic model for the request body
class QueryRequest(BaseModel):
    query: str

# Function to retrieve similar documents
def retrieve_documents(query, top_k=5):
    # Encode the query to match with the indexed documents
    query_embedding = embedder.encode([query])
    _, indices = index.search(np.array(query_embedding), top_k)
    retrieved_docs = [docs[i] for i in indices[0]]
    return "\n".join(retrieved_docs)

# Define RAG endpoint
@app.post("/generate_response/")
async def generate_response(request: QueryRequest):
    # Step 1: Retrieve relevant documents
    retrieved_docs = retrieve_documents(request.query)
    
    # Step 2: Use the retrieved context with OpenAI GPT
   
    try:
        chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": f"Based on the following information, answer the question:\n{retrieved_docs}\n\nQuestion: {request.query}\nAnswer:, if the information is not available, please give it based on your knowledge."},
            {"role": "user", "content": request.query},
        ],
        model="mixtral-8x7b-32768",
        )
        answer = chat_completion.choices[0].message.content
        return {"query": request.query, "answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
