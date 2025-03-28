import React, { useState, useContext, useEffect } from "react";
import UserContext from "../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterForm = () => {
	const { userData } = useContext(UserContext);
	const history = useNavigate();
	const [form, setForm] = useState({});
	 const [loading, setLoading] = useState(false);
	const onChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (
				!form.displayName ||
				!form.email ||
				!form.password ||
				!form.passwordCheck
			) {
				return toast.error("Please enter all fields.");
			}

			if (form.passwordCheck !== form.password) {
				return toast.error("Password does not match the check.");
			}

			if (form.password.length < 8) {
				return toast.error("Password must contain at least 8 characters.");
			}

			await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/users/register`, form);
			toast.success(
				"Check your email and follow the link to verify your account!"
			);
			history("/login");
		} catch (err) {
			toast.error(err.response.data.msg);
		}finally {
			setLoading(false);
		  }
	};

	useEffect(() => {
		if (userData.user) history("/");
	}, [userData.user, history]);

	return (
		<div className="col-md-6 log-reg-form">
			<form onSubmit={submit}>
				<div className="form-group">
					<label>Email</label>
					<input
						onChange={onChange}
						name="email"
						type="email"
						className="form-control"
						aria-describedby="emailHelp"
						placeholder="Enter email"
					/>
					<small id="emailHelp" className="form-text text-muted">
						We'll never share your email with anyone else.
					</small>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input
						onChange={onChange}
						type="password"
						name="password"
						className="form-control"
						placeholder="Password"
					/>
				</div>
				<div className="form-group">
					<label>Password Check</label>
					<input
						onChange={onChange}
						type="password"
						name="passwordCheck"
						className="form-control"
						placeholder="Verify Password"
					/>
				</div>
				<div className="form-group">
					<label>Preferred Name</label>
					<input
						onChange={onChange}
						type="text"
						name="displayName"
						className="form-control"
						placeholder="Preferred Name"
					/>
				</div>
				<button className="register-btn rounded-pill" type="submit" disabled={loading}>
					{loading ? "Loading..." : "Register"}
				</button>
				<button
					className="login-btn rounded-pill"
					style={{ margin: 20 }}
					onClick={() => history("/login")}
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default RegisterForm;
