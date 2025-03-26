import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import PetContext from "../../Context/PetContext";

import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
const AddPet = ({ show, handleClose }) => {
	const { REACT_APP_LOCAL_STORAGE } = process.env;

	const [file, setFile] = useState(null);
	const uploadedImage = useRef(null);
	const imageUploader = useRef(null);
	//state for new pet data to be added to db
	const [newPet, setnewPet] = useState(null);
	const { setNewPetData } = useContext(PetContext);

	//handle change of form data to be set for newPet state
	const handleChange = (e) => {
		setnewPet({ ...newPet, [e.target.name]: e.target.value });
	};

	//handel save button to add a new pet to db
	const saveNewPet = async (e) => {
		e.preventDefault();
		try {
			var formData = new FormData();

			formData.append("file", file);

			if (REACT_APP_LOCAL_STORAGE && file) {
				await axios
					.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/saveLocImage`, formData, {
						headers: { "x-auth-token": localStorage.getItem("auth-token") },
					})
					.then((data) => (newPet.PetImageLoc = data.data.fileUrl));
			}

			if (!REACT_APP_LOCAL_STORAGE && file) {
				await axios
					.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/saveImage`, formData, {
						headers: { "x-auth-token": localStorage.getItem("auth-token") },
					})
					.then((data) => (newPet.PetImageLoc = data.data.fileUrl));
			}

			await axios.post("${process.env.REACT_APP_BACKEND_API_URL}/api/pet", newPet, {
				headers: { "x-auth-token": localStorage.getItem("auth-token") },
			});
			toast.success("Pet added successfully");
			setNewPetData(true);
			window.location.reload();
		} catch (error) {
			console.log(error);
			toast.error("Error adding pet");
		}
	};

	const handleImage = async (e) => {
		e.preventDefault();
		try {
			let file = e.target.files[0];
			file && setFile(file);
			if (file) {
				const reader = new FileReader();
				const { current } = uploadedImage;
				current.file = file;
				reader.onload = (e) => {
					current.src = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		} catch (error) {
			toast.error(
				"There was a problem uploading the image, please try again" + error
			);
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Add Pet</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form className="p-3">
					<div className="mb-3">
						<label className="form-label fw-bold">Pet Name</label>
						<input
							onChange={handleChange}
							name="PetName"
							type="text"
							className="form-control"
							placeholder="Enter pet name"
						/>
					</div>

					<div className="mb-3">
						<label className="form-label fw-bold">Birth Date</label>
						<input
							onChange={handleChange}
							name="BirthDate"
							type="date"
							className="form-control"
						/>
					</div>

					<div className="mb-3">
						<label className="form-label fw-bold">Gender</label>
						<select name="Gender" onChange={handleChange} className="form-select">
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div className="mb-3">
						<label className="form-label fw-bold">Type of Pet</label>
						<select name="TypeOfPet" onChange={handleChange} className="form-select">
							<option value="">Select Pet Type</option>
							<option value="Dog">Dog</option>
							<option value="Cat">Cat</option>
							<option value="Bird">Bird</option>
							<option value="Fish">Fish</option>
							<option value="Reptile">Reptile</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div className="mb-3">
						<label className="form-label fw-bold">Breed</label>
						<input
							onChange={handleChange}
							name="Breed"
							type="text"
							className="form-control"
							placeholder="Enter breed"
						/>
					</div>
				</form>

			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>Close</Button>
				<Button variant="primary" onClick={saveNewPet}>Save Pet</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddPet;
