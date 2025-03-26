import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import PetContext from "../../Context/PetContext";
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const ChangePet = (props) => {
    const { REACT_APP_LOCAL_STORAGE } = process.env;
    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const [file, setFile] = useState(null);
    const [newPet, setnewPet] = useState(null);
    const { show, handleClose } = props;
    const { newPetData, setNewPetData } = useContext(PetContext);
    const pet = props.data;
    const history = useHistory();

    useEffect(() => {
        pet && setnewPet(pet);
    }, [pet]);

    useEffect(() => {
        newPetData &&
            history.push({
                pathname: "/petDash",
                state: { info: newPetData },
            });
    }, [newPetData]);

    const handleChange = (e) => {
        setnewPet({ ...newPet, [e.target.name]: e.target.value });
    };

    const updatePet = async (e) => {
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

            await axios.patch("${process.env.REACT_APP_BACKEND_API_URL}/api/updatepet/" + newPet._id, newPet, {
                headers: { "x-auth-token": localStorage.getItem("auth-token") },
            });
            toast.success("Pet updated successfully");
            setNewPetData(true);
        } catch (error) {
            console.log(error);
            toast.error("Error updating");
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
                <Modal.Title>Pet Editor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="p-3">
  {/* <div className="mb-3">
    <label className="form-label fw-bold">Add Photo <i className="fa fa-camera"></i></label>
    <div 
      className="d-flex justify-content-center align-items-center border rounded-circle"
      style={{ height: "80px", width: "80px", cursor: "pointer" }}
      onClick={() => imageUploader.current.click()}
    >
      <img
        ref={uploadedImage}
        src={newPet?.PetImageLoc || ""}
        alt="Pet"
        className="rounded-circle"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
    </div>
    <input
      type="file"
      accept="image/*"
      ref={imageUploader}
      name="PetImageLoc"
      className="d-none"
      onChange={(e) => handleImage(e)}
    />
  </div> */}

  <div className="mb-3">
    <label className="form-label fw-bold">Pet Name</label>
    <input
      onChange={handleChange}
      name="PetName"
      type="text"
      className="form-control"
      placeholder="Enter pet name"
      defaultValue={newPet?.PetName}
    />
  </div>

  <div className="mb-3">
    <label className="form-label fw-bold">Birth Date</label>
    <input
      onChange={handleChange}
      name="BirthDate"
      type="date"
      className="form-control"
      defaultValue={newPet?.BirthDate ? Moment(newPet.BirthDate).format("YYYY-MM-DD") : ""}
    />
  </div>

  <div className="mb-3">
    <label className="form-label fw-bold">Gender</label>
    <select name="Gender" onChange={handleChange} className="form-select">
      <option value="">Select Gender</option>
      <option value="Male" selected={newPet?.Gender === "Male"}>Male</option>
      <option value="Female" selected={newPet?.Gender === "Female"}>Female</option>
      <option value="Other" selected={newPet?.Gender === "Other"}>Other</option>
    </select>
  </div>

  <div className="mb-3">
    <label className="form-label fw-bold">Type of Pet</label>
    <select name="TypeOfPet" onChange={handleChange} className="form-select">
      <option value="">Select Pet Type</option>
      <option value="Dog" selected={newPet?.TypeOfPet === "Dog"}>Dog</option>
      <option value="Cat" selected={newPet?.TypeOfPet === "Cat"}>Cat</option>
      <option value="Bird" selected={newPet?.TypeOfPet === "Bird"}>Bird</option>
      <option value="Fish" selected={newPet?.TypeOfPet === "Fish"}>Fish</option>
      <option value="Reptile" selected={newPet?.TypeOfPet === "Reptile"}>Reptile</option>
      <option value="Other" selected={newPet?.TypeOfPet === "Other"}>Other</option>
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
      defaultValue={newPet?.Breed}
    />
  </div>
</form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={updatePet}>Save Pet</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePet;