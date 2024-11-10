import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [responseHistory, setResponseHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const chatContainerRef = useRef(null);


  // Sample list of popular questions for the sidebar
  
  const popularQuestions = [
    'Where is Birla Mandir located?',
    'What are the visiting hours of India Gate?',
    'What is the entry fee of Birla Mandir?',
    'How mcuh reviews are there for India Gate?',
    "In which Zone is Red Fort located?",
    "What is the significance of India Gate?",
    'How much time does it take to visit Charminar?',
    "What is the famous food in Hyderabad?",
    'What are the popular places in Jaipur?',
    'How can I reach Taj Mahal?',
    'Tell me the nearest hotel for stay near Manali?',  
    "Where is Taj Mahal located?",
    "Best time to visit Goa?",
    "How to reach Manali?",
    "Historical places in Rajasthan",
    "What are the popular places in Kerala?",
    "How to reach Shimla?",
    "What are the popular places in Goa?",

            
  ]; 

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/generate_response/', { query });
      setResponseHistory((prevHistory) => [
        ...prevHistory,
        { question: query, answer: res.data.answer },
      ]);
      setQuery('');
    } catch (error) {
      console.error("Error details:", error);
      setResponseHistory((prevHistory) => [
        ...prevHistory,
        { question: query, answer: 'Error fetching response. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to the latest message when response history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [responseHistory]);

  // Show "Scroll to Latest" button if user scrolls up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const atBottom =
        chatContainerRef.current.scrollTop + chatContainerRef.current.clientHeight >=
        chatContainerRef.current.scrollHeight - 10;

      setShowScrollButton(!atBottom);
    }
  };

  // Scroll to the latest response when the button is clicked
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    setShowScrollButton(false);
  };

  // Filter questions based on the search term
  const filteredQuestions = popularQuestions.filter((question) =>
    question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Indian Tourism RAG Assistant</h1>
        
        <div className="main-container" style={{ display: 'flex' }}>
          {/* Left Container for Searchable List */}
          <div className="left-container" style={{ width: '30%', paddingRight: '10px' }}>
            <h2>Suggested Questions</h2>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '50%', padding: '8px', marginBottom: '10px' }}
            />
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {filteredQuestions.map((question, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <button
                    onClick={() => setQuery(question)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px',
                      border: 'none',
                      backgroundColor: '#f0f0f0',
                      cursor: 'pointer',
                    }}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
            
          </div>


        {/* Chat Container */}
        <div
          className="chat-container"
          ref={chatContainerRef}
          onScroll={handleScroll}
          style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}
        >
          {responseHistory.map((qa, index) => (
            <div key={index} className="chat-bubble">
              <div className="user-question">
                <p><strong>Q:</strong> {qa.question}</p>
              </div>
              <div className="bot-answer">
                <p><strong>A:</strong> </p>
                <ReactMarkdown>{qa.answer}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && <p className="loading">Loading...</p>}
        </div>
        </div>

        <form onSubmit={handleQuerySubmit} className="query-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about a tourist location, hotels, foods..."
            className="query-input"
          />
          <button type="submit" className="submit-button" disabled={!query}>
            Get Answer
          </button>
        </form>
        {/* Scroll to Latest button inside chat container */}
        {showScrollButton && (
            <button className="scroll-button" onClick={scrollToBottom}>
              ↓ Scroll to Latest
            </button>
          )}
      </header>
    </div>
  );
}

export default App;
