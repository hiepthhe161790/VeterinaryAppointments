const mongoose = require("mongoose");
const Pets = require("./pets");
const DoctorModel = require("./doctorModel");
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+@.+\..+/, "Enter a valid email"],
	},
	password: { type: String, required: true, minLength: 5 },
	displayName: { type: String, required: true },
	confirmed: { type: Boolean, default: false },
	role: { type: String, enum: ["admin", "user","doctor"], default: "user" }, 
	doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorDetail"
    }
});

userSchema.pre("remove", async function (next) {
	try {
		await Pets.deleteMany({
			ParentID: {
				$in: this._id,
			},
		});
		if (this.doctor) {
            await DoctorModel.findByIdAndDelete(this.doctor);
        }
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = User = mongoose.model("user", userSchema);
