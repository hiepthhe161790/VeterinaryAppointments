import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Outlet
import '../../styles/AdminNavBar.css';
import UserContext from "../../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const AdminNavBar = () => {
  const { userData, setUserData } = useContext(UserContext);
  const history = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!userData?.user) {
        // Nếu userData.user không tồn tại, chuyển hướng về trang đăng nhập
        history("/login");
        toast.error("Session expired. Please login again.");
      } else if (userData.user.role === "admin" || userData.user.role === "doctor") {
        console.log("Welcome to the admin panel");
      } else {
        history("/");
        toast.error("You are not authorized to view this page");
      }
      setLoading(false); // Dừng trạng thái loading
    }, 2000);
  
    return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
  }, [userData?.user, history]);

  const logout = () => {
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
<div
  className="nav-container"
  style={{ background: "linear-gradient(90deg, rgba(89, 79, 234, 1) 0%, rgba(163, 50, 157, 1) 100%)" }}
>

        <Link to="/admin" className="nav-link">
          <h1 style={{ color: 'white' }}>Admin panel</h1>
        </Link>
        {userData.user && (
          <div className="user-info">
            <p style={{ color: 'white' }}>Welcome, {userData.user.displayName} - Role: {userData.user.role}</p>
            <p style={{ color: 'white' }}>
              <Link className="nav-link text-white fs-6" to="/homePage" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i> Log Out
              </Link>
            </p>
          </div>
        )}
      </div>
      {/* Render các route con */}
      <Outlet />
    </div>
  );
};

export default AdminNavBar;