import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ResendVerification.css'; // Import file CSS mới

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/users/resend-verification`, { email });
      setMessage(response.data.msg);
    } catch (error) {
      setError(error.response.data.msg);
    }
  };

  return (
    <div className="resend-verification-container">
       <h2>Your account has not been verified</h2>
      <p>Please input your email for the verification link.</p>
      <h2 className="text-center">Resend Verification Email</h2>
      <form onSubmit={handleSubmit} className="resend-verification-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button className="login-btn rounded-pill"  style={{ margin: 20 }} type="submit">Resend Verification Email</button>
      </form>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ResendVerification;