import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: input
      },
    ];

    setMessages(updatedMessages);

    try {
      const response = await axios.post(
        "http://localhost:5001/chat",
        {
          messages: updatedMessages,
        }
      );

      setMessages([
        ...updatedMessages,
        response.data,
      ]);

      // Reset input textbox
      setInput("");
    } catch (error) {
      console.error("Error talking to backend:", error);
    }
  }

  return (
    <>
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Chatbot Demo</h1>

      <div
        style={{
          border: "1px solid gray",
          padding: "1rem",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "1rem",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.role}:</strong>{" "}
            {message.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{
          width: "70%",
          padding: "0.5rem",
          marginRight: "1rem",
        }}
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
    </>
  )
}

export default App
