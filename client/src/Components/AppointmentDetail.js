import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/appointment_detail.css";

const AppointmentDetail = ({ appointment }) => {
    if (!appointment) {
        return <p className="text-center text-muted">No appointment selected.</p>;
    }

    return (
        <div className="container appointment-detail"  style={{ marginTop: '0px', padding: '10px' }}>
            <h5 className="text-center text-primary">Detail</h5>
            {/* Thông tin người đặt lịch */}
            <div className="section">
                <h6 className="text-secondary">📌 Customer Information</h6>
                <div className="info-row">
                    <span className="label">👤 Name:</span>
                    <span className="value">{appointment.name}</span>
                </div>
                <div className="info-row">
                    <span className="label">📧 Email:</span>
                    <span className="value">{appointment.email}</span>
                </div>
                <div className="info-row">
                    <span className="label">📞 Contact:</span>
                    <span className="value">{appointment.contact}</span>
                </div>
            </div>

            <hr />

            {/* Thông tin thú cưng */}
            <div className="section">
                <h6 className="text-secondary">🐶 Pet Information</h6>
                <div className="info-row">
                    <span className="label">🐾 Name:</span>
                    <span className="value">{appointment.petId?.PetName}</span>
                </div>
                <div className="info-row">
                    <span className="label">🎂 Birth Date:</span>
                    <span className="value">{new Date(appointment.petId?.BirthDate).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                    <span className="label">⚥ Gender:</span>
                    <span className="value">{appointment.petId?.Gender}</span>
                </div>
                <div className="info-row">
                    <span className="label">🐕 Breed:</span>
                    <span className="value">{appointment.petId?.Breed}</span>
                </div>
            </div>

            <hr />

            {/* Thông tin lịch hẹn */}
            <div className="section">
                <h6 className="text-secondary">🗓️ Appointment Information</h6>
                <div className="info-row">
                    <span className="label">📅 Date:</span>
                    <span className="value">{appointment.date}</span>
                </div>
                <div className="info-row">
                    <span className="label">⏰ Time:</span>
                    <span className="value">{appointment.time}</span>
                </div>
                <div className="info-row">
                    <span className="label">💰 Fee:</span>
                    <span className="value">${appointment.fee}</span>
                </div>
                <div className="info-row">
                    <span className="label">📋 Status:</span>
                    {appointment.status}
                </div>
            </div>

            <hr />

            {/* Thông tin bác sĩ */}
            <div className="section">
                <h6 className="text-secondary">👩‍⚕️ Doctor Information</h6>
                <div className="info-row">
                    <span className="label">🏥 Clinic:</span>
                    <span className="value">{appointment.doctorId?.name}</span>
                </div>
                <div className="info-row">
                    <span className="label">📍 Address:</span>
                    <span className="value">{appointment.doctorId?.address}</span>
                </div>
                <div className="info-row">
                    <span className="label">📞 Contact:</span>
                    <span className="value">{appointment.doctorId?.contact}</span>
                </div>
                <div className="info-row">
                    <span className="label">🎓 Experience:</span>
                    <span className="value">{appointment.doctorId?.experience} years</span>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetail;
