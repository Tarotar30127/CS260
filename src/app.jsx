import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Add } from './addpage/addpage';
import { Job } from './addjob/addjob'
import { About } from './about/about';
import { Login } from './login/login';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'; 

export function App() {
  console.log('app.jsx')
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [activeUsers, setActiveUsers] = React.useState(['Member 1', 'Member 2', 'Member 3']);

  // Simulate WebSocket for chat functionality
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { user: userName, text: newMessage };
      setChatMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  // Handle user activity
  React.useEffect(() => {
    if (authState === AuthState.Authenticated && userName) {
      const updateActiveUsers = () => {
        // Add this user to the active users list or simulate status change
        setActiveUsers(prevUsers => {
          return prevUsers.includes(userName) ? prevUsers : [...prevUsers, userName];
        });
      };
      
      // Initial update when user logs in
      updateActiveUsers();
      
      // Update periodically (could be handled via WebSocket in a real app)
      const interval = setInterval(updateActiveUsers, 5000);

      return () => clearInterval(interval); // Clean up on component unmount
    }
  }, [authState, userName]);

  return (
    <BrowserRouter>
      <div className='body bg-light text-dark'>
        <header className='container-fluid'>
          <nav className='navbar fixed-top navbar-light'>
            <div className='navbar-brand'>
              Jobs&Inventory<sup>&reg;</sup>
            </div>
            <menu className='navbar-nav'>
            <li className='nav-item'>
                <NavLink className='nav-link' to=''>
                  Login
                </NavLink>
              </li>
              {authState === AuthState.Authenticated && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='/home'>
                  Home
                </NavLink>
              </li>
              )}
              {authState === AuthState.Authenticated && (
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/add'>
                    Add Item
                  </NavLink>
                </li>
              )}
              {authState === AuthState.Authenticated && (
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/Job'>
                    Add Job
                  </NavLink>
                </li>
              )}
              <li className='nav-item'>
                <NavLink className='nav-link' to='/about'>
                  About
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
          />
          <Route path='/home' element={<Home userName={userName} />} />
          <Route path='/add' element={<Add userName={userName} />} />
          <Route path='/Job' element={<Job userName={userName} />} />
          <Route path='/about' element={<About userName={userName} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        {authState === AuthState.Authenticated && (
          <div className="container-fluid">
          {/* Floating Section */}
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
        </div>        
        )}
        

        <footer className='bg-gray-300 text-dark text-muted'>
          <div className='container-fluid'>
            <span className='text-reset text-right'>Carter Lee</span>
            <a className='text-reset text-right' href='https://github.com/Tarotar30127/startup'>
              Source
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;
