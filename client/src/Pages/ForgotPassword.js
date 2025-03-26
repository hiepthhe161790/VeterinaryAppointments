import React, { useContext, useEffect } from "react";
import UserContext from "../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import About from "../Components/About.js";
import ForgotPasswordForm from "../Components/ForgotPasswordForm.js";

const ForgotPassword = () => {
  const { userData } = useContext(UserContext);
  const history = useNavigate();
  useEffect(() => {
    if (userData.user) {
      if (userData.user.role === "admin" || userData.user.role === "doctor") {
        history("/admin");
      } else {
        history("/");
      }
      }
  }, [userData.user, history]);

  return (
    <div className="container-fluid">
      <div className="row align-items-center ">
        <About />
        <ForgotPasswordForm/>
      </div>
    </div>
  );
};

export default ForgotPassword;
