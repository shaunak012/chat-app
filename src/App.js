import React, { useEffect, useState } from 'react';
import './App.css';
import io from "socket.io-client"

let socket
const username = prompt('What is your name?');
function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {


    socket = io.connect('http://localhost:5000');

    socket.emit('new-user-joined', username);

    socket.on('user-joined', (name) => {
      append(name, ' joined the chat');
    });
    socket.on('recieve', (data) => {
      append(data.name, data.message)
      //This line is printing 2 times
      //solution : turn off strict mode
    });
    socket.on('user-disconnected', (name) => {
      append(name, ' left the chat');
    });
    return () => {
    }
  }, [])
  const append = (user, data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: user,
        content: data,
      },
    ]);
  };
  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim() !== '') {
      // append(user, message)
      //messages me add karta hai

      // Clear the message input field
      setMessage('');

      // Send the message to the server
      socket.emit("send", message);
    }
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
            <div key={index} className={`message`}>
              <span className="sender">{message.sender}: </span>
              <span className="content">{message.content}</span>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}

          // Update the input value using state and onChange event
          />
          <button type="submit" >Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
