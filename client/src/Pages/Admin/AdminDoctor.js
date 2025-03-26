import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../../styles/admin.css';
import AdminSideBar from './AdminSideBar';
import { Link } from 'react-router-dom';

const AdminDoctor = () => {
    const [users, setUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/users/alluser`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                let data = await res.json();
                let filteredData = data.filter(user => user.doctor);
                setUsers(filteredData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

   
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredUsers = users.filter((user) => {
        return (
            (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

   
    

    return (
        <div>
            <div id="after-nav">
                <AdminSideBar />
                <div id="after-nav-col-2" className="side-part appointment all-appoint">
                    <div >
                        <h1 className="d-flex justify-content-center">Veterinarian</h1>
                    </div>
                    <div id="chek">
                       
                     
                        <div className="chekin">
                            <label>Search</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by email or name"
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <table id="customers">
            <thead>
                            <tr>
                                <th scope="col">Name Doctor</th>
                                <th scope="col">Facility, spa</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Clinic/Facility</th>
                                <th scope="col">Experience</th>
                                <th scope="col">Specialization</th>
                 
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody id="appointment">
                            {currentUsers?.map((user) => (
                                <tr key={user?._id}>
                                    <td>{user?.displayName}</td>
                                    <td>{user?.doctor.name}</td>
                                    <td>{user?.doctor.gender}</td>
                                    <td>{user?.doctor.contact}</td>
                                    <td>{user?.doctor.address}</td>
                                    <td>{user?.doctor.experience}</td>
                                    <td>{user?.doctor.specialization}</td>
                                    <td>
                                        {user?.doctor ? (
                                            <Link to={`/admin/view-doctor/${user.doctor._id}`}>
                                                <button className="btn btn-secondary">
                                                    View
                                                </button>
                                            </Link>
                                        ) : (
                                            <Link to={`/admin/add-doctor/${user._id}`}>
                                                <button className="btn btn-primary">
                                                    Add Doctor
                                                </button>
                                            </Link>
                                        )}
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav className="d-flex justify-content-center">
                        <ul className="pagination">
                            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
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
        </div>
    );
};

export default AdminDoctor;