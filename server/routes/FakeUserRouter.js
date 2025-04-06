const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const FakeUserRouter = express.Router();

FakeUserRouter.post("/generate-fake-users", async (req, res) => {
    try {
        const vietnameseNames = [
            "NguyenVanA", "TranThiB", "LeVanC", "PhamThiD", "HoangVanE",
            "VuThiF", "DangVanG", "BuiThiH", "DoVanI", "NgoThiJ",
            "NguyenVanK", "TranThiL", "LeVanM", "PhamThiN", "HoangVanO",
            "VuThiP", "DangVanQ", "BuiThiR", "DoVanS", "NgoThiT"
        ];

        const users = [];
        const salt = await bcrypt.genSalt();

        for (const name of vietnameseNames) {
            const email = `${name.toLowerCase()}@example.com`;
            const passwordHash = await bcrypt.hash("password123", salt);
            const user = new User({
                email,
                password: passwordHash,
                displayName: name,
                confirmed: true,
                role: "user",
            });
            users.push(user);
        }

        await User.insertMany(users);

        res.status(201).json({ msg: "20 fake users created successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error creating fake users" });
    }
});

module.exports = {FakeUserRouter};