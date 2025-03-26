import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/admin.css";
import AdminSideBar from "./AdminSideBar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const UpdateDoctor = () => {
  const { id } = useParams(); // Lấy doctorId từ URL
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    experience: "",
    specialization: "",
    contact: "",
    address: "",
    name: "",
  });

  // Lấy dữ liệu bác sĩ hiện tại
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/doctor/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            gender: data.gender || "",
            age: data.age || "",
            experience: data.experience || "",
            specialization: data.specialization || "",
            contact: data.contact || "",
            address: data.address || "",
            name: data.name || "",
          });
        } else {
          toast.error("Doctor not found");
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Error fetching doctor");
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/doctor/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Doctor updated successfully");
     
      } else {
        toast.error("Doctor this name already exists");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error("Error updating doctor");
    }
  };

  return (
    <div>
      <div id="after-nav">
        <AdminSideBar />
        <div id="after-nav-col-2" className="side-part appprov">
          <div className="add-form">
            <div className="heading">
              <h1>Update Veterinarian</h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ad-row">
                <label>Name of veterinary facility, spa:</label>
                <input id="name" type="text" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="ad-row">
                <label>Contact:</label>
                <input
                  id="contact"
                  type="number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ad-row">
                <label>Address:</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ad-row">
                <label>Gender:</label>
                <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                >
                <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>

                    </select>
                    </div>
              <div className="ad-row">
                <label>Date of Birth:</label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ad-row">
                <label>Experience:</label>
                <input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ad-row">
                <label>Specialization:</label>
                <input
                  id="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ad-row">
                <button id="btn1" className="add-btn btn" type="submit">
                  Update
                </button>
                <Link to="/admin/doctors">
                    <button id="btn2" className="add-btn btn">
                        Cancel
                    </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctor;
