import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/admin.css';
import AdminSideBar from './AdminSideBar';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    experience: '',
    specialization: '',
    contact: '',
    address: '',
    userID: '',
    name: '',
  });
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      setFormData((prev) => ({ ...prev, userID: id }));
    }
  }, [id]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/doctor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Doctor added successfully');
        setFormData({
          gender: '',
          age: '',
          experience: '',
          specialization: '',
          contact: '',
          address: '',
          userID: id,
          name: '',
        });
      } else {
        toast.error('Doctor already exists');
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div>
      <div id="after-nav">
        <AdminSideBar />
      <div id="after-nav-col-2" className="side-part appprov">
        <div>
          <div className="add-form">
            <div className="heading">
              <h1>Add Veterinarian</h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ad-row">
                <label>Name of veterinary facility, spa:</label>
                <input
                  id="name"
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ad-row">
                <label>Contact:</label>
                <input
                  id="contact"
                  placeholder="Contact"
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
                  placeholder="Address"
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
                  placeholder="age"
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
                  placeholder="experience"
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
                  placeholder="Specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ad-row">
                <button id="btn1" className="add-btn btn" type="submit">
                  ADD
                </button>
                <Link to="/admin/users">
                    <button id="btn2" className="add-btn btn">
                        Cancel
                    </button>
                </Link>
              </div>
            </form>
            <p>User ID: {formData.userID}</p>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
};

export default AddDoctor;