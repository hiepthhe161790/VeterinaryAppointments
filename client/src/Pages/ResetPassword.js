import React, { useContext, useEffect } from "react";
import UserContext from "../Context/UserContext.js";
import { useNavigate } from "react-router-dom";
import About from "../Components/About.js";
import ResetPasswordForm from "../Components/ResetPasswordForm.js";

const ResetPassword = () => {
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
        <ResetPasswordForm/>
      </div>
    </div>
  );
};

export default ResetPassword;
