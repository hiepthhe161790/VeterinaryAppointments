import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const ResetPasswordForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/users/reset-password/${token}`, {
        password,
        passwordCheck,
      });
        toast.success(response.data.msg);
    } catch (error) {
        toast.error(error.response.data.msg);
    }
  };
console.log("token", token);
  return (
    <div className="col-md-6 log-reg-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={passwordCheck}
            className="form-control"
            placeholder="Confirm Password"
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
        </div>
        <button className="register-btn rounded-pill" style={{ margin: 20 }} type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;