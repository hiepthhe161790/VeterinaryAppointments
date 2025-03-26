const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    experience: Number,
    specialization: String,
    address: String,
    contact: Number,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    versionKey: false
});

const DoctorModel = mongoose.models.DoctorDetail || mongoose.model("DoctorDetail", doctorSchema);

module.exports = { DoctorModel };