import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

const PayOs = ({ appointment }) => {
    const [loading, setLoading] = useState(false); // Trạng thái loading

    const handlePlaceAppointment = async () => {
        setLoading(true); // Bắt đầu loading
        try {
            // Gọi API để tạo liên kết thanh toán
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/appointment/update-payos`, {
                appointmentId: appointment._id,
                paymentMethod: "PayOS",
                fee: 5000,
            });
            console.log("Response data:", response.data);
            // Kiểm tra phản hồi từ server
            if (response.data.paymentLink) {
                Swal.fire({
                    title: "Payment Link Generated",
                    text: "Click OK to proceed to payment.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    // Mở liên kết thanh toán
                    window.open(response.data.paymentLink, "_blank");
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to generate payment link.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Error generating payment link:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while generating the payment link.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false); // Dừng loading
        }
    };

    return (
        <div>
        {appointment.paymentStatus === "Completed" ? (
            <div className="text-success d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i> Payment Successful
            </div>
        ) : (
            <button className="btn btn-primary" onClick={handlePlaceAppointment} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Pay with PayOS"}
            </button>
        )}
    </div>
    );
};

export default PayOs;