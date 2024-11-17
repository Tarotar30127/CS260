import React from 'react';

export function ChatAndUsers({ userName }) {
  const [chatMessages, setChatMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [activeUsers, setActiveUsers] = React.useState([]);

  // Handle sending a new chat message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = { user: userName, text: newMessage };
      setChatMessages((prevMessages) => [...prevMessages, message]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
        });
        if (!response.ok) throw new Error('Failed to send message');
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setNewMessage('');
    }
  };

  // Fetch active users
  React.useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('/api/users/active');
        if (response.ok) {
          const data = await response.json();
          setActiveUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch active users:', error);
      }
    };

    fetchActiveUsers();
  }, []);

  // Fetch chat messages
  React.useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch('/api/chat');
        if (response.ok) {
          const data = await response.json();
          setChatMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
      }
    };

    fetchChatMessages();
  }, []);

  return (
    <div className="floating-right-section">
      {/* Team Members Section */}
      <div className="team-members">
        <h2>Team Members</h2>
        <ul>
          {activeUsers.map((member, index) => (
            <li key={index} className="team-member">
              <div className="status-dot"></div>
              <span>{member}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <h2>Chat</h2>
        <ul>
          {chatMessages.map((msg, index) => (
            <li key={index} className="message">
              <span>{msg.user}:</span> {msg.text}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
