import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import UserContext from "../../Context/UserContext";
import axios from "axios";

const DeleteAccount = ({ show, handleClose }) => {
  const { userData, setUserData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/users/delete/${userData.user.id}`, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      });
      setUserData({ token: undefined, user: undefined });
      localStorage.setItem("auth-token", "");
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Do you really want to delete your account? This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAccount;
