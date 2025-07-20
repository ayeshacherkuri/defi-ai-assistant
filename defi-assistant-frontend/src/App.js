import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your DeFi AI Assistant. How can I help?", fromUser: false }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, fromUser: true }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post('http://127.0.0.1:5000/chat', {
        message: input
      });

      const reply = response.data.reply;
      setMessages([...newMessages, { text: reply, fromUser: false }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Error reaching AI.", fromUser: false }]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 20 }}>
      <h2>💬 DeFi AI Assistant</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 400, overflowY: "scroll", marginBottom: 10 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            textAlign: msg.fromUser ? "right" : "left",
            margin: "10px 0"
          }}>
            <span style={{ 
              backgroundColor: msg.fromUser ? "#d1e7dd" : "#e2e3e5",
              padding: "10px 15px",
              borderRadius: "15px",
              display: "inline-block"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: "80%", padding: 10 }}
        placeholder="Type your DeFi goal..."
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 5 }}>Send</button>
    </div>
  );
}

export default App;
