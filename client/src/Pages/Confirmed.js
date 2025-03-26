import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Confirmed = () => {
  const history = useNavigate();
  const { token } = useParams(); // Lấy tham số "token" từ URL

  useEffect(() => {
    (async () => {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/register`, { token });
        history("/");
      } catch (err) {
        console.log(err);
      }
    })();
  }, [history, token]);

  return <div>You are confirmed {token}</div>;
};

export default Confirmed;