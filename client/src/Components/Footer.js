import React, { useContext, useState } from "react";
import DeleteAccount from "./Modals/DeleteAccount";
import UserContext from "../Context/UserContext";
import { Button } from "react-bootstrap";

const Footer = () => {
  const { userData } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <footer className="text-center text-lg-start text-white mt-5" style={{ backgroundColor: "#42389d" }}>
      <div className="p-4" style={{ textAlign: "left" }}>
        <div className="row my-4">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="rounded-circle bg-white shadow d-flex align-items-center justify-content-center mb-4 mx-auto" style={{ width: "120px", height: "120px" }}>
              <img src="https://mdbootstrap.com/img/Photos/new-templates/animal-shelter/logo.png" height="60" alt="Logo" loading="lazy" />
            </div>
            <p className="text-center">Helping homeless animals find a home.</p>
            <div className="d-flex justify-content-center">
              <a className="text-white px-2" href="#"><i className="fab fa-facebook-square"></i></a>
              <a className="text-white px-2" href="#"><i className="fab fa-instagram"></i></a>
              <a className="text-white px-2" href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">VetCare</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Missing Pets</a></li>
              <li><a href="#" className="text-white">Recently Found</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Animals</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">General Info</a></li>
              <li><a href="#" className="text-white">About Shelter</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Contact</h5>
            <ul className="list-unstyled">
              <li><p><i className="fas fa-map-marker-alt"></i> Warsaw, Poland</p></li>
              <li><p><i className="fas fa-phone"></i> +01 234 567 89</p></li>
              <li><p><i className="fas fa-envelope"></i> vetcare@gmail.com</p></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        © 2025 Vetcare.com
      </div>

      <div className="container text-center mt-3">
        {userData.user && (
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        )}
      </div>

      <DeleteAccount show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
    </footer>
  );
};

export default Footer;
