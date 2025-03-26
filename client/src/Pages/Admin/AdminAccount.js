import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../../styles/admin.css';
import AdminSideBar from './AdminSideBar';
import { Link } from 'react-router-dom';

const AdminAccount = () => {
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
                setUsers(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredUsers = users.filter((user) => {
        return (
            (statusFilter !== '' ? user.confirmed === (statusFilter === 'true') : true) &&
            (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const rejectUser = async (id) => {
        try {
            let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/users/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id }),
            });
            let data = await res.json();
            Swal.fire('Status updated', '', 'success');
            setUsers((prev) =>
                prev.map((user) =>
                    user._id === id ? {
                        ...user, confirmed: !user.confirmed
                    } : user
                )
            );
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'Something went wrong!', 'error');
        }
    };


    return (
        <div>
            <div id="after-nav">
                <AdminSideBar />
                <div id="after-nav-col-2" className="side-part appointment all-appoint">
                    <div >
                        <h1 className="d-flex justify-content-center">Users</h1>
                    </div>
                    <div id="chek">
                        <div className="chekin">
                            <label>Confirm</label>
                            <select
                                id="myselect"
                                className="form-select"
                                aria-label="Default select example"
                                onChange={handleStatusChange}
                            >
                                <option value="">All</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>

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
                        <thead >
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col">Name</th>
                                <th scope="col">Status</th>
                                <th scope="col">Role</th>
                                <th scope="col">Doctor</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody id="appointment">
                            {currentUsers?.map((user) => (
                                <tr key={user?._id}>
                                    <td>{user?.email}</td>
                                    <td>{user?.displayName}</td>
                                    <td style={{ fontWeight: 'bold', color: user?.confirmed ? 'green' : 'red' }}>
                                        {user?.confirmed ? "Yes" : "No"}
                                    </td>

                                    <td>{user?.role}</td>
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
                                    <td>

                                        {user?.confirmed ? (
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => rejectUser(user._id)}
                                            >
                                                Reject
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => rejectUser(user._id)}
                                            >
                                                Approve
                                            </button>
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

export default AdminAccount;