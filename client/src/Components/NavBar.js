import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../Context/UserContext";
import Notify from "./Modals/Notify";
import PetContext from "../Context/PetContext";
import { Modal } from "react-bootstrap";
import HandleAppoint from "./Helpers/HandleAppoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
	const { userData, setUserData } = useContext(UserContext);
	const [links, setLinks] = useState(null);
	const { appt, setAppt } = useContext(PetContext);
	const { pets } = useContext(PetContext);
	const [show, setShow] = useState(false);
	const [vals, setVals] = useState([]);
	const [about, showAbout] = useState(false);

	const logout = () => {
		setUserData({ token: undefined, user: undefined });
		localStorage.setItem("auth-token", "");
	};

	const linkStyle = {
		textDecoration: "none",
		color: "black",
	};

	const handleClose = () => {
		setShow(false);
	};

	const closeAbout = () => {
		showAbout(false);
	};

	const openAbout = () => {
		showAbout(true);
	};

	useEffect(async () => {
		if (!userData.user) {
			setLinks(
				<ul className="navbar-nav ms-auto">
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/homePage">
							<i className="bi bi-house-door"></i> Home
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/book-appointment">
							<i className="bi bi-calendar-check"></i> Book Appointment
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/login">
							<i className="bi bi-box-arrow-in-right"></i> Login
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/register">
							<i className="bi bi-person-plus"></i> Register
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="#" onClick={openAbout}>
							<i className="bi bi-info-circle"></i> About
						</Link>
					</li>
				</ul>
			);
		} else {
			setLinks(
				<ul className="navbar-nav ms-auto">
					{appt > 0 && (
						<li className="nav-item">
							<Link to="#" className="nav-link text-white fs-6 position-relative" onClick={() => setShow(true)}>
								<i className="bi bi-bell-fill text-warning"></i>
								<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
									{appt}
								</span>
							</Link>
						</li>
					)}
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/homePage">
							<i className="bi bi-house-door"></i> Home
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/">
							<i className="bi bi-person"></i>My pets
						</Link>
					</li>

					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/book-appointment">
							<i className="bi bi-calendar-check"></i> Book Appointment
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/view-appointment">
							<i className="bi bi-eye"></i> View Appointment
						</Link>
					</li>
					<li className="nav-item">
						<a className="nav-link text-white fs-6" href="/videosharing.html" target="_blank">
							<i className="bi bi-chat-dots"></i> Connect with Doctor
						</a>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="#" onClick={openAbout}>
							<i className="bi bi-info-circle"></i> About
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-white fs-6" to="/homePage" onClick={logout}>
							<i className="bi bi-box-arrow-right"></i> Log Out
						</Link>
					</li>
				</ul>
			);
			setAppt(HandleAppoint(pets, "nav"));

			appt && setVals(HandleAppoint(pets, "notify"));
		}
	}, [userData, appt, pets]);

	return (
		<>
			<nav className="navbar navbar-expand-lg" style={{
				background: "linear-gradient(90deg, rgba(89, 79, 234, 1) 0%, rgba(163, 50, 157, 1) 64%)",
			}}>
				<div className="container-fluid">
					<h3 className="navbar-brand fw-bold text-white px-3" style={{ fontSize: "28px", letterSpacing: "1px" }}>
						<img src="/images/paw-print-small.png" alt="MyPet Logo" style={{ height: "30px", width: "auto" }} />  PET HEALTH CHECK
					</h3>



					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<FontAwesomeIcon icon={faBars} style={{ color: "white" }} />
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						{links}
						<Modal name="test" show={show} onHide={handleClose}>
							<div className="ms-auto">
								<button
									style={{
										marginRight: "10px",
										marginTop: "10px",
										marginBottom: "0",
									}}
									type="button"
									className="btn-close"
									aria-label="Close"
									onClick={handleClose}
								></button>
							</div>
							<Modal.Body>
								<Notify vals={vals} />
							</Modal.Body>
						</Modal>

						<Modal name="about" show={about} onHide={closeAbout}>
							<Modal.Body>
								<div className="card text-center  border-0">
									<div className="ms-auto">
										<button
											type="button"
											className="btn-close"
											aria-label="Close"
											onClick={closeAbout}
										></button>
									</div>
									<h5 className="card-title">The My Pet App</h5>

									<div className="card-body">
										<img
											src="/images/paw_logo.PNG"
											alt="petLogo"
											className="p-3 img-fluid rounded-circle w-10"
										></img>

										<p className="card-text">
											Love your pet and want to make sure they are well taken
											care of? It can be difficult to keep up with regular pet
											exams, yearly vaccinations, and medications. After all, we
											have a hard enough time keeping up with our own health let
											alone that of our furry, feathery, or scaly friends.
											That's where My Pet comes in! A user friendly app that
											keeps track of your pets and all their medical needs for a
											healthier life.
										</p>
									</div>
								</div>
							</Modal.Body>
						</Modal>
					</div>
				</div>
			</nav>
		</>
	);
};

export default NavBar;
