const express = require("express");
const Pet = require("../models/pets");
const User = require("../models/userModel");
const { DoctorModel } = require("../models/DoctorModel");
const { AppointmentModel } = require("../models/AppointmentModel");

const FakeAppointmentRouter = express.Router();

FakeAppointmentRouter.post("/generate-fake-appointments", async (req, res) => {
    try {
        // Lấy danh sách tất cả thú cưng, bác sĩ và người dùng
        const pets = await Pet.find({});
        const doctors = await DoctorModel.find({});
        const users = await User.find({ role: "user" });

        if (!pets.length || !doctors.length || !users.length) {
            return res.status(400).json({ msg: "No pets, doctors, or users found to create appointments." });
        }

        const appointments = [];

        // Danh sách các dịch vụ
        const serviceCategories = [
            "Health Checkup",
            "Pet Whitening Bath",
            "Grooming",
            "Skin Care",
            "Disease Treatment",
            "Vaccination",
            "Dental Cleaning",
            "Nail Trimming",
            "Emergency Care",
            "Massage Therapy"
        ];

        // Hàm tạo số điện thoại Việt Nam ngẫu nhiên
        const generateRandomPhoneNumber = () => {
            const prefixes = ["032", "033", "034", "035", "036", "037", "038", "039", "070", "079", "077", "076", "078", "083", "084", "085", "081", "082", "056", "058", "059"];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = Math.floor(1000000 + Math.random() * 9000000); // Random 7 chữ số
            return `${prefix}${suffix}`;
        };

        for (const pet of pets) {
            const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
            const parentUser = users.find(user => user._id.toString() === pet.ParentID.toString());

            if (!parentUser) continue;

            let appointmentCreated = false;

            while (!appointmentCreated) {
                // Random ngày trong khoảng từ hiện tại đến 1 tháng sau
                const now = new Date();
                const oneMonthLater = new Date();
                oneMonthLater.setMonth(now.getMonth() + 1);
                const appointmentDate = new Date(now.getTime() + Math.random() * (oneMonthLater.getTime() - now.getTime()));
            
                // Random giờ trong ngày (từ 8:00 AM đến 6:00 PM)
                const randomHour = Math.floor(Math.random() * 10) + 8; // Giờ từ 8 đến 17 (8 AM - 6 PM)
                const randomMinute = Math.random() > 0.5 ? "00" : "30"; // Chọn phút là 00 hoặc 30
                const appointmentTime = `${randomHour}:${randomMinute}`;
            
                // Kiểm tra xem ngày và giờ đã được đặt với bác sĩ này chưa
                const existingAppointment = await AppointmentModel.findOne({
                    doctorId: randomDoctor._id,
                    date: appointmentDate.toISOString().split("T")[0],
                    time: appointmentTime,
                });
            
                if (existingAppointment) {
                    console.log(`Doctor ${randomDoctor.name} is already booked on ${appointmentDate.toISOString().split("T")[0]} at ${appointmentTime}. Retrying...`);
                    continue; // Thử lại với ngày và giờ khác
                }
            
                const isRejected = Math.random() < 0.1; // 10% cơ hội bị reject
                const paymentStatuses = ["Pending", "Failed", "Refunded"];
                const paymentStatus = isRejected ? paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)] : "Completed";
            
                const randomCategory = serviceCategories[Math.floor(Math.random() * serviceCategories.length)]; // Chọn ngẫu nhiên danh mục dịch vụ
            
                const newAppointment = {
                    userID: parentUser._id,
                    name: parentUser.displayName || "Anonymous",
                    email: parentUser.email || "unknown@example.com",
                    contact: generateRandomPhoneNumber(),
                    doctorId: randomDoctor._id,
                    date: appointmentDate.toISOString().split("T")[0], // Chỉ lấy phần ngày
                    time: appointmentTime,
                    symptoms: "Routine checkup for pet health.",
                    category: randomCategory, // Gán danh mục dịch vụ ngẫu nhiên
                    roomId: isRejected ? undefined : Math.floor(Math.random() * 9000) + 1000, // Chỉ có roomId nếu không bị reject
                    petId: pet._id,
                    fee: 100000,
                    status: isRejected ? "rejected" : "approved",
                    paymentStatus: paymentStatus,
                    paymentMethod: "PayOS",
                    paymentDetails: {
                        transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
                        orderCode: `ORD${Math.floor(Math.random() * 1000000)}`,
                        paymentLinkId: `LINK${Math.floor(Math.random() * 1000000)}`,
                        paymentTime: isRejected ? null : new Date(), // Chỉ có thời gian thanh toán nếu không bị reject
                    },
                };
            
                appointments.push(newAppointment);
            
                // Nếu cuộc hẹn bị reject, tạo lại cuộc hẹn mới
                if (isRejected) {
                    console.log(`Appointment for pet ${pet.PetName} was rejected. Retrying...`);
                } else {
                    appointmentCreated = true; // Cuộc hẹn thành công
                }
            }
        }

        // Lưu tất cả các cuộc hẹn vào cơ sở dữ liệu
        if (appointments.length > 0) {
            await AppointmentModel.insertMany(appointments);
            return res.status(201).json({ msg: `${appointments.length} fake appointments created successfully.` });
        } else {
            return res.status(400).json({ msg: "No appointments were created." });
        }
    } catch (error) {
        console.error("Error generating fake appointments:", error);
        return res.status(500).json({ msg: "Error generating fake appointments." });
    }
});

module.exports = {FakeAppointmentRouter};