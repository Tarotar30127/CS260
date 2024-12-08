import React, { useState, useEffect, useRef } from 'react';

export function ChatAndUsers({ userName }) {
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const chatMessagesRef = useRef([]); // Store messages in memory

  // Initialize WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socketRef.current = new WebSocket(`${protocol}://${window.location.host}/ws`);

    // Display that we have opened the WebSocket
    socketRef.current.onopen = () => {
      appendMsg('system', 'websocket', 'connected');
    };

    // Display messages we receive from our friends
    socketRef.current.onmessage = (event) => {
      const chat = JSON.parse(event.data); // Directly parse event.data assuming it's a string
      appendMsg('friend', chat.name, chat.msg);
    };

    // If the WebSocket is closed, then disable the interface
    socketRef.current.onclose = () => {
      appendMsg('system', 'websocket', 'disconnected');
    };

    // Cleanup the WebSocket connection when the component is unmounted
    return () => {
      socketRef.current.close();
    };
  }, []); // Empty dependency array to run only once on mount

  // Send a message over the WebSocket
  function sendMessage() {
    if (newMessage) {
      appendMsg('me', userName, newMessage);
      socketRef.current.send(JSON.stringify({ name: userName, msg: newMessage }));
      setNewMessage(''); // Clear input after sending the message
    }
  }

  // Create one long list of messages and store in memory
  function appendMsg(cls, from, msg) {
    // Store the message in memory
    chatMessagesRef.current = [
      { user: from, text: msg },
      ...chatMessagesRef.current,
    ];
    // Manually trigger a re-render by updating the state
    // This causes the UI to reflect the changes without using `useState` for the messages
    forceUpdate();
  }

  // Force a re-render by updating an internal state (used to manually trigger re-render)
  const [, forceUpdate] = useState(0);

  return (
    <div className="floating-right-section">
      {/* Chat Section */}
      <div className="chat-section">
        <h2>Chat</h2>
        <ul id="chat-text">
          {chatMessagesRef.current.map((msg, index) => (
            <li key={index} className="message">
              <span>{msg.user}:</span> {msg.text}
            </li>
          ))}
        </ul>
        <input
          id="new-msg"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
