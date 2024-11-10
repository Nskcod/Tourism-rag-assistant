Indian Tourism RAG Assistant

The Indian Tourism RAG (Retrieval-Augmented Generation) Assistant is an interactive application designed to answer questions related to Indian tourist locations, places, hotels, foods. It combines a React frontend with a FastAPI backend, using FAISS for document similarity search and Groq API for language generation. The assistant retrieves relevant information from a pre-defined corpus and generates responses to user queries.

Table of Contents

* Features
* Installation
* Usage
* Project Structure
* API Endpoints
* Technical Details
* Acknowledgements

Features

* Document Retrieval: Retrieves relevant documents from a FAISS-indexed corpus based on the user's query.
* Language Generation: Uses the Groq API to generate responses based on the retrieved documents.
* Interactive UI: User-friendly React interface for inputting questions and displaying answers.
* CORS-enabled: Configured for cross-origin requests between the React frontend and FastAPI backend.

Installation

Prerequisites

* Node.js and npm (for the frontend)
* Python 3.7+ and pip (for the backend)
* FAISS (for efficient similarity search)
* Groq API access with a valid API key
* sentence-transformers for embedding generation

Clone the Repository

git clone https://github.com/Nskcod/rag-assistant.git
cd tourism-rag-assistant

Backend Setup

1. Create a virtual environment:

python3 -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate

2. Install dependencies:

pip install -r requirements.txt

3. Set up the FAISS index:

* Ensure tourism_index.faiss and Top-Indian-Places-to-Visit.txt are in the same directory.
* This index should contain the document embeddings needed for retrieval.

4. Configure API Key:

* Replace YOUR_GROQ_API_KEY with your Groq API key in main.py.

5. Run the Backend:

uvicorn main:app --reload


Frontend Setup

1. Navigate to frontend folder:

cd Rag-tourism

2. Install dependencies:

npm install

3. Start the React development server:

npm start

The React app will be available at http://localhost:3000.


Usage

* Open the frontend at http://localhost:3000.
* Enter a question related to Indian tourism (e.g., "What are the best places to visit in Jaipur?").
* Submit the query to receive a response generated by the RAG model.


Project Structure

tourism-rag-assistant/
│
├── backend/
│   ├── main.py               # FastAPI app and API endpoint
│   ├── tourism_index.faiss    # Precomputed FAISS index for document embeddings
│   ├── Top-Indian-Places-to-Visit.txt  # Source document corpus
│   ├── requirements.txt       # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component for user interaction
│   │   ├── index.js           # Entry point for React application
│   ├── package.json           # Frontend dependencies
│
└── README.md                  # Project documentation


API Endpoints

/generate_response/
* Method: POST
* Description: Retrieves relevant documents and generates a response using the Groq API.
* Request Body: JSON

{
    "query": "What are the best tourist locations in India?"
}


* Response: JSON

{
    "query": "What are the best tourist locations in India?",
    "answer": "The best tourist locations include..."
}


Technical Details

* FAISS Index: Uses FAISS to quickly search through embeddings of documents to retrieve relevant information based on the query.
* SentenceTransformer: Generates embeddings from user queries and documents.
* Groq API: Handles the language generation for question-answering based on the retrieved documents.
* CORS: Configured for cross-origin resource sharing to enable the React frontend to interact with the FastAPI backend.

Acknowledgements

* FAISS by Facebook AI for efficient similarity search.
* SentenceTransformers for providing easy-to-use embeddings for document similarity.
* Groq API for enabling advanced language generation.

License: This project is licensed under the MIT License.
