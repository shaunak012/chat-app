import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([{
    sender: "Me",
    content: "HI MUMMY"
  }]);

  // Function to handle sending a message
  const sendMessage = (e) => {
    e.preventDefault();
    // Logic to send the message to the server or update the message state
  };
  return (
    <>
      <div className="chat-app">
        <div className="chat-header">
          <h2>Global Chat Room</h2>
        </div>

        <div className="chat-messages">
          {/* Render the messages from the state */}
          {messages.map((message, index) => (
            <div key={index} className="message">
              <span className="sender">{message.sender}: </span>
              <span className="content">{message.content}</span>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
          // Update the input value using state and onChange event
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
