require("dotenv").config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Confirm = require("../models/confirmModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const { get } = require("http");
// const { rejects } = require("assert");

module.exports = {
	register: async (req, res) => {
		try {
			const { email, password, passwordCheck, displayName } = req.body;

			if (!email || !password || !passwordCheck || !displayName) {
				return res
					.status(400)
					.json({ msg: "Not all fields have been entered" });
			}

			if (passwordCheck.length < 8) {
				return res.status(400).json({ msg: "You need a longer password" });
			}

			if (password !== passwordCheck) {
				return res
					.status(400)
					.json({ msg: "password does not match the password check" });
			}

			const existingUser = await User.findOne({ email: email });

			if (existingUser) {
				return res.status(400).json({ msg: "User already exists" });
			}

			const salt = await bcrypt.genSalt();
			const passwordHash = await bcrypt.hash(password, salt);

			const newUser = new User({
				email,
				password: passwordHash,
				displayName,
				role: "user",
			});

			// confirmation with email starts here
			const confirmationToken = new Confirm({
				token: crypto.randomBytes(10).toString("hex"),
				userID: newUser._id,
			});

			console.log(confirmationToken);

			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.VetcareEmail,
					pass: process.env.password,
				},
			});

			const mailOptions = {
				from: process.env.VetcareEmail,
				to: newUser.email,
				subject: "Thanks for signing up",
				text: `Email was sent: ${process.env.HEROKU}/confirm_token/${confirmationToken.token}`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log(
						`Email was sent: ${process.env.HEROKU}/confirm_token/${confirmationToken.token}`
					);
				}
			});

			await confirmationToken.save();
			const savedUser = await newUser.save();
			res.json(savedUser);
		} catch (err) {
			res.status(500).json({ msg: err });
		}
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body;
	
			if (!email || !password) {
				return res.status(400).json({ msg: "all required fields were not sent" });
			}
	
			const user = await User.findOne({ email: email });
	
			if (!user) {
				return res.status(400).json({ msg: "User doesn't exist" });
			}
	
			const isMatch = await bcrypt.compare(password, user.password);
	
			if (!isMatch) {
				return res.status(400).json({ msg: "this was an incorrect password" });
			}
	
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "24h",
			});
	
			return res.json({
				token,
				user: {
					id: user._id,
					displayName: user.displayName,
					confirmed: user.confirmed,
					role: user.role,
				},
			});
		} catch (err) {
			return res.status(500).json({ msg: err });
		}
	},

	getUser: async (req, res) => {
		try {
			const user = await User.findById(req.user).populate("doctor");

			res.json({
				displayName: user.displayName,
				id: user._id,
				role: user.role,
				doctorId: user?.doctor?._id,
			});
		} catch (err) {
			res.send(err.response);
		}
	},

	deleteUser: async (req, res) => {
		try {
			const user = await User.findById({ _id: req.params.id });
			user.remove();
			res.json(user);
		} catch (err) {
			res.send(err.response);
		}
	},
	getAllUsers: async (req, res) => {
		try {
			const users = await User.find().populate('doctor');
			res.json(users);
		} catch
		(err) {
			res.send(err.response);
		}
	},
	rejectOrComfirmUser: async (req, res) => {
		try {
			const user = await User.findById(req.body.userId);
			if (!user) {
				return res.status(404).json({ msg: "User not found" });
			}
	
			user.confirmed = !user.confirmed;
			await user.save();
	
			res.json(user);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: "User with this email does not exist" });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const confirmation = await Confirm.findOne({ userID: user._id });

            if (confirmation) {
                confirmation.resetPasswordToken = token;
                confirmation.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                await confirmation.save();
            } else {
                const newConfirmation = new Confirm({
                    token: crypto.randomBytes(10).toString("hex"),
                    userID: user._id,
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 3600000, // 1 hour
                });
                await newConfirmation.save();
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.VetcareEmail,
                    pass: process.env.password,
                },
            });

            const mailOptions = {
                from: process.env.VetcareEmail,
                to: user.email,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                ${process.env.HEROKU}/reset-password/${token}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ msg: 'Error sending email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ msg: 'Password reset email sent' });
                }
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { password, passwordCheck } = req.body;

            if (!password || !passwordCheck) {
                return res.status(400).json({ msg: "Not all fields have been entered" });
            }

            if (password !== passwordCheck) {
                return res.status(400).json({ msg: "Passwords do not match" });
            }

            const confirmation = await Confirm.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!confirmation) {
                return res.status(400).json({ msg: "Password reset token is invalid or has expired" });
            }

            const user = await User.findById(confirmation.userID);

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            user.password = passwordHash;
            await user.save();

            confirmation.resetPasswordToken = undefined;
            confirmation.resetPasswordExpires = undefined;
            await confirmation.save();

            res.status(200).json({ msg: "Password has been reset" });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
	resendVerificationEmail: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: "User with this email does not exist" });
            }

            if (user.confirmed) {
                return res.status(400).json({ msg: "This account is already verified" });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const confirmation = await Confirm.findOne({ userID: user._id });

            if (confirmation) {
                confirmation.token = token;
                await confirmation.save();
            } else {
                const newConfirmation = new Confirm({
                    token: token,
                    userID: user._id,
                });
                await newConfirmation.save();
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.VetcareEmail,
                    pass: process.env.password,
                },
            });

            const mailOptions = {
                from: process.env.VetcareEmail,
                to: user.email,
                subject: 'Email Verification',
                text: `You are receiving this because you (or someone else) have requested the verification of the email for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                ${process.env.HEROKU}/confirm_token/${token}\n\n
                If you did not request this, please ignore this email.\n`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ msg: 'Error sending email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ msg: 'Verification email sent' });
                }
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
};
