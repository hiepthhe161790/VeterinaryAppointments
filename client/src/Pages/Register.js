import React, { useContext, useEffect } from "react";
import UserContext from "../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../Components/RegisterForm.js";
import About from "../Components/About.js";

const Register = () => {
	const { userData} = useContext(UserContext);
	const history = useNavigate();
	useEffect(() => {
		if (userData.user) history("/");
	}, [userData.user, history]);

	return (
		<div>
			<div className="container-fluid">
				<div className="row align-items-center ">
				<About />	
				<RegisterForm />			
				</div>
			</div>
		</div>
	);
};

export default Register;
