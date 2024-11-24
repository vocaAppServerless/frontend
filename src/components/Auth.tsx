import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          const userInfo = await auth.sign(code);
          dispatch({ type: "SET_USER_INFO", value: userInfo });
          navigate("/");
        } else {
          navigate("/");
        }
      } catch (error: any) {
        alert("Authentication failed: " + error.message);
      }
    };

    authenticateUser();
  }, [dispatch, navigate]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default Auth;
