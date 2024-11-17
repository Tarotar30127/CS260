import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';


export function Login({ userName, authState, onAuthChange }) {
  return (
    <main className='container-fluid bg-light text-center'>
      <div className='rounded border p-5' style={{ 
          backgroundColor: '#aedadd', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
          transition: 'box-shadow 0.3s ease' 
        }}>
        {authState !== AuthState.Unknown && <h1 style={{ marginBottom: '30px' }}>Welcome to Jobs&Inventory</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
      
     
    </main>
  );
}
