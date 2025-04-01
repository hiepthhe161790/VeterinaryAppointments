import React, { useState, useContext, useEffect } from "react";
import UserContext from "../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import ResendVerification from "./ResendVerification";
import "../styles/ModalStyles.css";
const LoginForm = () => {
  const { userData, setUserData } = useContext(UserContext);
  const history = useNavigate();
  const [form, setForm] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const submitLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/users/login`, form);
     
      if (!data.user.confirmed) {
        toast.error(
          "Your account has not been verified, please check your email."
        );
        setIsModalOpen(true);
      } else {
        setUserData({
          token: data.token,
          user: data.user,
        });
        
        localStorage.setItem("auth-token", data.token);
         if (data.user.role === "admin" || data.user.role === "doctor") {
          history("/admin");
        } else {
          history("/");
        }
      }
    } catch (err) {
      console.log("err", err.response);
      toast.error(err?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.user) history("/");
  }, [userData.user, history]);

  return (
    <div className="col-md-6 log-reg-form">
      <form onSubmit={submitLoginForm}>
        <div className="form-group">
          <label>Email</label>
          <input
            onChange={onChange}
            name="email"
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            onChange={onChange}
            type="password"
            name="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>

        <button className="login-btn rounded-pill" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          className="register-btn rounded-pill"
          style={{ margin: 20 }}
          onClick={() => history("/Register")}
        >
          Register
        </button>
        <button
          className="register-btn rounded-pill"
          style={{ margin: 30 }}
          onClick={() => history("/forgot-password")}
        >
          Forgot Password
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Resend Email Verification"
      >
          <ResendVerification />
      </Modal>
    </div>
  );
};
export default LoginForm;
