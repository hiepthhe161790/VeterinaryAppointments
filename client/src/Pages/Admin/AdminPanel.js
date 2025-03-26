import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../../styles/admin.css';
import AdminSideBar from './AdminSideBar';
import { Link } from 'react-router-dom';
import { getAllDoctors } from '../../Components/Helpers/DoctorFuntion';
import AppointmentDetail from '../../Components/AppointmentDetail';
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(8);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [sortOrder, setSortOrder] = useState({ date: 'asc', time: 'asc' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasNewData, setHasNewData] = useState(false); // Trạng thái thông báo có dữ liệu mới

  const fetchAppointments = async () => {
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/getall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let data = await res.json();

      // Kiểm tra nếu dữ liệu mới khác với dữ liệu hiện tại
      if (JSON.stringify(data) !== JSON.stringify(appointments)) {
        setHasNewData(true); // Hiển thị thông báo có dữ liệu mới
      }

      setAppointments(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments(); // Lấy dữ liệu ban đầu

    const interval = setInterval(() => {
      fetchAppointments(); // Tự động làm mới dữ liệu mỗi 5 giây
    }, 5000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [appointments]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsData = await getAllDoctors();
      setDoctors(doctorsData);
    };
    fetchDoctors();
  }, []);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDoctorChange = (e) => {
    setDoctorFilter(e.target.value);
  };

  const handleSort = (field) => {
    const newSortOrder = { ...sortOrder };
    newSortOrder[field] = sortOrder[field] === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) {
      return sortOrder.date === 'asc' ? dateComparison : -dateComparison;
    }
    const timeComparison = a.time.localeCompare(b.time);
    return sortOrder.time === 'asc' ? timeComparison : -timeComparison;
  });

  const filteredAppointments = sortedAppointments.filter((appointment) => {
    return (
      (statusFilter ? appointment.status === statusFilter : true) &&
      (doctorFilter ? appointment.doctorId?._id === doctorFilter : true)
    );
  });

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const acceptAppointment = async (id) => {
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });
      let data = await res.json();
      if (data) {
        Swal.fire('Status updated', '', 'success');
        setDataUpdated(!dataUpdated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectAppointment = async (id) => {
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });
      let data = await res.json();
      if (data) {
        Swal.fire('Status updated', '', 'success');
        setDataUpdated(!dataUpdated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const handleRefresh = async () => {
    setStatusFilter("");
    setDoctorFilter("");
    setSortOrder({ date: "asc", time: "asc" });

    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/getall`);
      let data = await res.json();
      setAppointments(data);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div>
      <div id="after-nav">
        <AdminSideBar />
        <div id="after-nav-col-2" className="side-part appointment all-appoint">
          <div>
            <h1 className="d-flex justify-content-center">Appointments</h1>
            {hasNewData ? (
              <div
                className="notification-icon position-fixed top-10 end-0 m-3 p-2 bg-light shadow rounded d-flex align-items-center"
                style={{ cursor: "pointer", zIndex: 1050 }}
                onClick={() => setHasNewData(false)}
              >
                <i className="bi bi-bell-fill text-warning me-2"></i>
                <span className="fw-bold text-dark">New data available!</span>
              </div>
            ) : (
              <div
                className="notification-icon position-fixed top-10 end-0 m-3 p-2 bg-light shadow rounded d-flex align-items-center"
                style={{ zIndex: 1050 }}
              >
                <i className="bi bi-bell-fill text-secondary"></i>
              </div>
            )}

          </div>
          <div id="chek">
            <div className="chekin">
              <label>
                <h2>Status:</h2>
              </label>
              <select id="myselect" value={statusFilter} onChange={handleStatusChange}>
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="chekin">
              <label>
                <h2>Doctor:</h2>
              </label>
              <select id="mydoctor" value={doctorFilter} onChange={handleDoctorChange}>
                <option value="">Select Veterinarians</option>
                {doctors?.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="chekin">
              <div className="chekin d-flex align-items-center gap-2">
                <label>Refresh data</label>
                <button
                  onClick={handleRefresh}
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>

          </div>
          <table id="customers" className="w-90">
            <thead>
              <tr>
                <th scope="col">Pet/Breed</th>
                <th scope="col">
                  Date
                  <button onClick={() => handleSort('date')}>
                    {sortOrder.date === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
                <th scope="col">
                  Time
                  <button onClick={() => handleSort('time')}>
                    {sortOrder.time === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
                <th scope="col">Status</th>
                <th scope="col">Veterinarian</th>
                <th scope="col">Room ID</th>
                <th scope="col">Payment</th>
                <th scope="col">Approve</th>
                <th scope="col">Reject</th>
                <th scope="col">Detail</th>
                <th scope="col">Reminder</th>
              </tr>
            </thead>
            <tbody id="appointment">
              {currentAppointments?.length > 0 ? (
                currentAppointments?.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      {appointment?.petId?.PetName} / {appointment?.petId?.Breed}
                      <i
                        className="bi bi-eye-fill"
                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
                        data-bs-toggle="modal"
                        data-bs-target={`#petModal-${appointment._id}`}
                      ></i>

                      {/* Modal hiển thị chi tiết thú cưng */}
                      <div
                        className="modal fade"
                        id={`petModal-${appointment._id}`}
                        tabIndex="-1"
                        aria-labelledby="petModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered modal-lg"
                          style={{ transition: "transform 0.3s ease-out" }}>
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="petModalLabel">Information Pet</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <p><strong>Name:</strong> {appointment?.petId?.PetName}</p>
                              <p><strong>Breed:</strong> {appointment?.petId?.Breed}</p>
                              <p><strong>BirthDate:</strong> {appointment?.petId?.BirthDate}</p>
                              <p><strong>Parent:</strong> {appointment?.petId?.ParentID?.displayName}</p>
                              <p><strong>Type Of Pet:</strong> {appointment?.petId?.TypeOfPet}</p>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{appointment?.date}</td>
                    <td>{appointment.time}</td>
                    <td className={getStatusClass(appointment?.status)}>
                      {appointment?.status}
                    </td>
                    <td>{appointment?.doctorId?.name}</td>
                    <td>{appointment?.roomId}</td>
                    <td>{appointment?.paymentStatus}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => acceptAppointment(appointment._id)}>Approve</button>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={() => rejectAppointment(appointment._id)}>Reject</button>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => openModal(appointment)}>
                        <i className="bi bi-eye-fill"></i>
                      </Button>
                    </td>
                    <td>
                      <Link to={`admin/petDash/${appointment?.petId?._id}`}>
                        <button className="btn btn-primary">Reminder</button>
                      </Link>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No Data Available</td>
                </tr>
              )}
            </tbody>
          </table>
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({ length: Math.ceil(filteredAppointments.length / appointmentsPerPage) }, (_, index) => (
                <li key={index + 1} className="page-item">
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
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

export default AdminPanel;