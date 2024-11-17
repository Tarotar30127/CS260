import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
      });
  }

  async function addToActiveUsers(email) {
    try {
      const response = await fetch(`/api/users/active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user to active list');
      }

      console.log('User added to active users');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Add to active users when the component is rendered
  useEffect(() => {
    if (props.userName) {
      addToActiveUsers(props.userName);
    }
  }, [props.userName]);

  return (
    <div>
      <Button variant="primary" onClick={() => navigate('/home')}>
        Home
      </Button>
      <Button variant="secondary" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
