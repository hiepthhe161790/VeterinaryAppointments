import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Confirmed = (props) => {
  const history = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/register`, { token: props.match.params.token });
        history("/");
      } catch (err) {
        console.log(err);
      }
    })();
  }, [history, props.match.params.token]);
  return <div>You are confirmed {props.match.params.token}</div>;
};

export default Confirmed;
