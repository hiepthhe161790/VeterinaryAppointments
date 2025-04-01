const express = require("express");
const userModel = require("../models/userModel");
const { DoctorModel } = require("../models/DoctorModel");

const doctorRouter = express.Router();

doctorRouter.get("/getall", async (req, res) => {
    try {
        let user = await DoctorModel.find({});
        res.json(user);
    } catch (error) {
        res.json({ "Error": error.message });
    }
});

doctorRouter.get("/getDocID", async (req, res) => {
    try {
        let name = req.headers.name;
        let user = await DoctorModel.findOne({ "name": name });
        res.json({ "ID": user._id });
    } catch (error) {
        console.log({ "Error": error.message });
        res.json({ "Error": error.message });
    }
});

doctorRouter.post("/register", async (req, res) => {
    try {
        const { userID, gender, age, experience, specialization, address, contact, name } = req.body;

        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin accounts cannot be registered as doctors" });
        }
        if (user.role === "doctor") {
            return res.status(400).json({ message: "User is already a doctor" });
        }

        const doctorExists = await DoctorModel.findOne({ name });
        if (doctorExists) {
            return res.status(400).json({ message: "Doctor already exists" });
        }

        const newDoctor = new DoctorModel({
            userID,
            gender,
            age,
            experience,
            specialization,
            address,
            contact,
            name
        });

        // Lưu vào database
        await newDoctor.save();

        // Cập nhật user với doctorId
        user.doctor = newDoctor._id;
        user.role = "doctor";
        await user.save();

        res.status(201).json({
            message: "Doctor Registered Successfully",
            doctorId: newDoctor._id,
            userId: user._id
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

doctorRouter.delete("/delete", async (req, res) => {
    try {
        const id = req.query.id; 

        const doctor = await DoctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

  
        await DoctorModel.findByIdAndDelete(id);

        const user = await userModel.findById(doctor.userID);
        if (user) {
            user.doctor = null;
            user.role = "user"; 
            await user.save();
        }

        res.json({ message: "Doctor and associated user data deleted successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

doctorRouter.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let user = await DoctorModel
            .findById(id)
            .populate("userID");
        res.json(user);
    } catch (error) {
        res.json({ "Error": error.message });
    }
});

doctorRouter.put("/:id", async (req, res) => {
    try {
        const { gender, age, experience, specialization, address, contact, name } = req.body;
        const doctor = await DoctorModel.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        if (doctor.name !== name) {
            const doctorExists = await DoctorModel.findOne({ name });
            if (doctorExists) {
                return res.status(400).json({ message: "Doctor already exists" });
            }
        }

        doctor.gender = gender ?? doctor.gender;
        doctor.age = age ?? doctor.age;
        doctor.experience = experience ?? doctor.experience;
        doctor.specialization = specialization ?? doctor.specialization;
        doctor.address = address ?? doctor.address;
        doctor.contact = contact ?? doctor.contact;
        doctor.name = name ?? doctor.name;

        await doctor.save();

        res.status(200).json({
            message: "Doctor Updated Successfully",
            updatedDoctor: doctor
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { doctorRouter };