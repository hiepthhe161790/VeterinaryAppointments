import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "../../styles/AdminNavBar.css"; // Giữ file CSS cũ
import UserContext from "../../Context/UserContext.js";
const AdminSideBar = () => {
  const location = useLocation();
  const { userData } = useContext(UserContext);
  return (
    <div className="admin-nav d-flex flex-column p-3 vh-100">
      <h3 className="text-center mb-4">Dashboard</h3>
      <Nav className="flex-column">
        <Nav.Item className="admin-nav-item">
          <Nav.Link
            as={Link}
            to="/admin"
            className={location.pathname === "/admin" ? "active-nav" : ""}
          >
            <h2>Statistical</h2>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="admin-nav-item">
          <Nav.Link
            as={Link}
            to="/admin/appointment"
            className={location.pathname === "/admin/appointment" ? "active-nav" : ""}
          >
            <h2>Manage Appointment</h2>
          </Nav.Link>
        </Nav.Item>
        {userData?.user?.role === "doctor" && (
          <Nav.Item className="admin-nav-item">
            <Nav.Link
              as={Link}
              to={`/admin/view-doctor/${userData?.user?.doctorId}`}
              className={location.pathname === `/admin/view-doctor/${userData?.user?.doctorId}` ? "active-nav" : ""}
            >
              <h2>Doctor Profile</h2>
            </Nav.Link>
          </Nav.Item>
        )}
        {userData?.user?.role !== "doctor" && (
          <>
            <Nav.Item className="admin-nav-item">
              <Nav.Link
                as={Link}
                to="/admin/users"
                className={location.pathname === "/admin/users" ? "active-nav" : ""}
              >
                <h2>Manage Users</h2>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="admin-nav-item">
              <Nav.Link
                as={Link}
                to="/admin/doctors"
                className={location.pathname === "/admin/doctors" ? "active-nav" : ""}
              >
                <h2>Manage Veterinarians</h2>
              </Nav.Link>
            </Nav.Item>
          </>
        )}
        <Nav.Item className="admin-nav-item">
          <a href="/admin/videosharing.html" className={location.pathname === "/videosharing.html" ? "active-nav" : ""}>
            <h2>Virtual Meet</h2>
          </a>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default AdminSideBar;
