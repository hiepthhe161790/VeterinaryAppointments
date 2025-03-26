import React, { useContext, useEffect } from "react";
import UserContext from "../Context/UserContext.js";
import { useHistory } from "react-router-dom";
import About from "../Components/About.js";
import ForgotPasswordForm from "../Components/ForgotPasswordForm.js";

const ForgotPassword = () => {
  const { userData } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (userData.user) {
      if (userData.user.role === "admin" || userData.user.role === "doctor") {
        history.push("/admin");
      } else {
        history.push("/");
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
