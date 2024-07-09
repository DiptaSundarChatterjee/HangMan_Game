import React, { useState } from 'react';
import Hangman from './Hangman'
import Login from './Login';
import Register from './Register';
import {jwtDecode} from 'jwt-decode';
import './App.css'

function App() {
  const [token, setToken] = useState(null);

  const getUsernameFromToken = () => {
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.username;
  };

  const username = getUsernameFromToken();

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="App">
      {token ? (
        <Hangman token={token} username={username} handleLogout={handleLogout} />
      ) : (
        <>
          <Login handleLogin={handleLogin} />
          <Register />
          
        </>
      )}
    </div>
  );
}

export default App;
