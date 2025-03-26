import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

const VietQr = ({ appointment }) => {
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false); // Trạng thái loading

    const addInfo = encodeURIComponent(`${appointment.name} - ${appointment._id}`);
    const accountName = encodeURIComponent("Nguyen Hoang Khoi Minh");

    const qrUrl = `https://img.vietqr.io/image/TCB-19035703304019-compact.png?amount=${appointment.fee}&addInfo=${addInfo}&accountName=${accountName}`;

    const generateQr = async () => {
        setLoading(true); // Bắt đầu loading
        try {
            const response = await axios.get(qrUrl, {
                responseType: "arraybuffer",
            });

            const qrImage = Buffer.from(response.data, "binary").toString("base64");
            setQrData(`data:image/png;base64,${qrImage}`);
            setShowModal(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // Dừng loading
        }
    };

    const ConfirmPayment = async (id) => {
        console.log("ConfirmPayment called with id:", id);
        try {
            let res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/update-paymentStatus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let data = await res.json();
            console.log("Response data:", data);
            if (data.mess) {
                Swal.fire('Payment Confirmed, Thank you!');
                setShowModal(false);
            } else {
                Swal.fire('Payment not Confirmed');
            }
        } catch (error) {
            console.log("Error in ConfirmPayment:", error);
        }
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={generateQr} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Generate QR"}
            </button>

            {/* Bootstrap Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">QR Code Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : qrData ? (
                        <img src={qrData} alt="QR Code" className="img-fluid" />
                    ) : (
                        <p className="text-muted">Generating QR Code...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                {!appointment.paymentStatus && (
                        <Button variant="success" onClick={() => ConfirmPayment(appointment._id)}>
                            Confirm Payment
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {error && <p className="text-danger mt-2">Error: {error}</p>}
        </div>
    );
};

export default VietQr;