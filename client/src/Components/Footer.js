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
            <p className="text-center">Providing top-notch veterinary care and spa services for your beloved pets.</p>
            <div className="d-flex justify-content-center">
              <a className="text-white px-2" href="https://www.facebook.com/profile.php?id=61573049399958"><i className="fab fa-facebook-square"></i></a>
              <a className="text-white px-2" href="#"><i className="fab fa-instagram"></i></a>
              <a className="text-white px-2" href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Our Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">General Checkups</a></li>
              <li><a href="#" className="text-white">Vaccinations</a></li>
              <li><a href="#" className="text-white">Pet Grooming</a></li>
              <li><a href="#" className="text-white">Emergency Care</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Pet Spa</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Full Grooming</a></li>
              <li><a href="#" className="text-white">Nail Trimming</a></li>
              <li><a href="#" className="text-white">Massage Therapy</a></li>
              <li><a href="#" className="text-white">Dental Cleaning</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li><p><i className="fas fa-map-marker-alt"></i> Ho Chi Minh City, Vietnam</p></li>
              <li><p><i className="fas fa-phone"></i> 0938070451</p></li>
              <li><p><i className="fas fa-envelope"></i>khoiminh04071980@gmail.com</p></li>
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
