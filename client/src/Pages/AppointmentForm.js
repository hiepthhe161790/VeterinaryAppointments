import React, { useContext, useState, useEffect, use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '.././styles/appointment_form.css';
import '.././styles/index.css';
import '.././styles/navbar.css';
import UserContext from "../Context/UserContext";
import { getAllDoctors } from '../Components/Helpers/DoctorFuntion';
import PetContext from '../Context/PetContext';
import { useNavigate } from "react-router-dom";
import AddPet from '../Components/Modals/AddPet';
import { loadUserPets } from '../Components/Helpers/PetFunctions';
const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    date: '',
    time: '',
    doctorId: '',
    symptoms: '',
    category: '',
    petId: '',
  });

  const history = useNavigate();
  const { userData } = useContext(UserContext);
  const userDetails = userData.user;
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userData.user) history("/");
  }, [userData.user, history]);
  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsData = await getAllDoctors();
      setDoctors(doctorsData);
    };
    fetchDoctors();
  }, []);
  useEffect(() => {
    const fetchPets = async () => {
      const petsData = await loadUserPets(userDetails?.id);
      setPets(petsData);

    };
    fetchPets();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, contact, date, time, doctorId, symptoms, category, petId } = formData;

    if (!name || !email || !contact || !date || !time || !symptoms || !category) {
      Swal.fire('Please fill in all the details');
      return;
    }

    const appointment = {
      userID: userDetails.id,
      name,
      email,
      contact,
      date,
      time,
      doctorId,
      symptoms,
      category,
      petId,
      status: "pending"
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      const data = await response.json();
      if (data === 'Please Login again') {
        Swal.fire('Please login again');
        history("/login");
      } else if (data === 'Appointment Created') {
        Swal.fire('Appointment created', '', 'success');
        setTimeout(() => {
          history("/view-appointment");
        }, 2000);
      } else {
        Swal.fire('Slot Not Available', 'Try a different time slot', 'error');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };



  return (
    <div>
      {/* Navbar Start */}
      <div id="navbar"></div>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="heading">Appointment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group row">
                <label className="col-sm-4">Full Name</label>
                <div className="col-sm-8 col-lg-8">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Email</label>
                <div className="col-sm-8 col-lg-8">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Contact No.</label>
                <div className="col-sm-8 col-lg-8">
                  <input
                    type="number"
                    id="contact"
                    className="form-control"
                    placeholder="Enter contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Doctor Name</label>
                <div className="col-sm-8 col-lg-8">
                  <select
                    name="doctorId"
                    id="doctorId"
                    className="form-control"
                    value={formData?.doctorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">select address</option>
                    {doctors
                      ?.filter((doctor) => doctor?.name)
                      .map((doctor) => (
                        <option key={doctor?._id} value={doctor?._id}>
                          {doctor?.name} - {doctor?.address}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Category</label>
                <div className="col-sm-8 col-lg-8">
                  <select
                    name="category"
                    id="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Health Checkup">Health Checkup</option>
                    <option value="Pet Whitening Bath">Pet Whitening Bath</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Disease Treatment">Disease Treatment</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Dental Cleaning">Dental Cleaning</option>
                    <option value="Nail Trimming">Nail Trimming</option>
                    <option value="Emergency Care">Emergency Care</option>
                    <option value="Massage Therapy">Massage Therapy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">My Pet

                  <i
                    className="bi bi-plus-circle ml-2 text-primary"
                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                    onClick={() => setShowModal(true)}
                  ></i>

                </label>
                <div className="col-sm-8 col-lg-8">
                  <select
                    name="petId"
                    id="petId"
                    className="form-control"
                    value={formData?.petId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">select pet</option>
                    {pets?.map((pet) => (
                      <option key={pet._id} value={pet._id}>
                        {pet.PetName} - {pet.TypeOfPet} - {pet.Breed}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Date</label>
                <div className="col-sm-8 col-lg-8">
                  <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Time</label>
                <div className="col-sm-8 col-lg-8">
                  <input
                    type="time"
                    id="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4">Symptoms</label>
                <div className="col-sm-8 col-lg-8">
                  <textarea
                    id="symptoms"
                    className="form-control"
                    value={formData.symptoms}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="form-group row justify-content-end">
                <div className="col-sm-5">
                  <button className="form_btn" type="submit">
                    Book Now
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6" id="img_box">
            <img
              src="./images/appointment.jpg"
              className="img-fluid"
              alt=""
            />
          </div>
        </div>
      </div>
      {/* Footer start */}
      <div id="footer"></div>
      <AddPet show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
};

export default AppointmentForm;