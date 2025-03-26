import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/index.css';
import '../../styles/navbar.css';
import Swal from 'sweetalert2';
import UserContext from '../Context/UserContext';

const Index = () => {
  const [roomID, setRoomID] = useState('');
  const { userData,setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomID.trim() === '') {
      Swal.fire({ icon: 'error', title: 'Room ID is required!' });
      return;
    }
    localStorage.setItem('RoomID', roomID);
    navigate('/chat');
  };
  const handleLogout = () => {
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
};

  return (
    <div>
      <div id="navbar"></div>
      <div id="wrapp">
        <div id="logoDiv">
          <img id="logo2" src="https://mdbootstrap.com/img/Photos/new-templates/animal-shelter/logo.png" alt="logo" onClick={() => navigate('/')} />
        </div>
        <h1 id="h1">VetCare Virtual Meet</h1>
        <h2 id="h2">Enter Room ID to Connect</h2>
        <div id="form">
          <input
            type="text"
            placeholder="Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
          />
          <button id="joinRoom" onClick={handleJoinRoom}>
            Connect
          </button>
        </div>
        {userData?.user ? (
          <button id="loginbtn" onClick={handleLogout}>Logout</button>
        ) : (
          <button id="loginbtn" onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
      <div id="footer"></div>
    </div>
  );
};

export default Index;
