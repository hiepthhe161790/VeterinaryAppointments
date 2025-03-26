import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import UserContext from '../Context/UserContext';
import '.././styles/appointment_list.css';
import '.././styles/index.css';
import '.././styles/navbar.css';
// import VietQr from '../Components/VietQr';
import AppointmentDetail from '../Components/AppointmentDetail';
import { Modal, Button, Pagination } from "react-bootstrap";
import PayOs from '../Components/PayOs';

const AppointmentList = () => {
  const { userData } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(6);
  useEffect(() => {
    const getData = async () => {
      const data = userData?.user;
      const userId = data?.id;
      if (userId) {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/get`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              id: `${userId}`,
            },
          });
          const data = await res.json();
          if (data.length > 0) {
            document.getElementById('not_available').style.display = 'none';
          }
          setAppointments(data);
          setDataLoaded(true); 
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };
  
    const timeout = setTimeout(() => {
      if (!userData?.user) {
        Swal.fire('Session expired. Please login again.');
        setLoading(false);
      }
    }, 3000); // 3 giây
  
    getData();
  
    return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
  }, [userData]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && !userData?.user && !dataLoaded) {
        Swal.fire('Please login again');
      }
    }, 3000); 
  
    return () => clearTimeout(timer); 
  }, [loading, userData, dataLoaded]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredAppointments = appointments.filter((appointment) =>
    filter ? appointment.status === filter : true
  );

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="appointment-container">
      {/* Navbar Start */}
      <div id="navbar"></div>

      {/* Appointments List */}
      <h2 id="title">Appointment List</h2>
      <div id="filter_box">
        <p>Filter by status</p>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="">Please select...</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table style={{ marginTop: '50px' }}>
        <thead>
          <tr>
            <th scope="col">Veterinary Spa</th>
            <th scope="col">Pet Name</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Room ID</th>
            <th scope="col">Fee</th>
            <th scope="col">Payment</th>
            <th scope="col">Status</th>
            <th scope="col">Details</th>
            <th scope="col">Deposit</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {loading && (
            <tr>
              <td colSpan="10" id="not_available">
                Loading...
              </td>
            </tr>
          )}
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <tr key={appointment?._id}>
                <td className="truncate" title={appointment?.doctorId?.address}>{appointment?.doctorId?.name} ({appointment?.doctorId?.address})</td>
                <td>{appointment?.petId.PetName}</td>
                <td>{appointment?.date}</td>
                <td>{appointment?.time}</td>
                <td>{appointment?.roomId}</td>
                <td>{appointment?.fee}</td>
                <td>{appointment?.paymentStatus}</td>
                <td>{appointment?.status}</td>
                <td>
                  <Button variant="outline-primary" size="sm" onClick={() => openModal(appointment)}>
                    <i className="bi bi-eye-fill"></i>
                  </Button>
                </td>
                {/* <td><VietQr appointment={appointment} /></td> */}
                <td><PayOs appointment={appointment} /></td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" id="not_available">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination>
        {Array.from({ length: Math.ceil(filteredAppointments.length / appointmentsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <AppointmentDetail appointment={selectedAppointment} />
          ) : (
            <p className="text-center">No appointment selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentList;