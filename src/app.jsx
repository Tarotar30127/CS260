import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Add } from './addpage/addpage';
import { Job } from './addjob/addjob'
import { About } from './about/about';
import { Login } from './login/login';
import { AuthState } from './login/authState';
import { ChatAndUsers } from './chat/chatAndUser';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'; 

export function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

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
                <>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/home'>
                      Home
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/add'>
                      Add Item
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/Job'>
                      Add Job
                    </NavLink>
                  </li>
                </>
              )}
              <li className='nav-item'>
                <NavLink className='nav-link' to='/about'>
                  About
                </NavLink>
              </li>
            </menu>
            {authState === AuthState.Authenticated && (
              <div className="welcome-message">
                <span>Welcome, {userName}</span>
              </div>
            )}
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

        {authState === AuthState.Authenticated && <ChatAndUsers userName={userName} />}
      </div>

      <footer className='bg-gray-300 text-dark text-muted'>
          <div className='container-fluid'>
            <span className='text-reset text-right'>Carter Lee</span>
            <a className='text-reset text-right' href='https://github.com/Tarotar30127/startup'>
              Source
            </a>
          </div>
      </footer>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;