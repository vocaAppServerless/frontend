import React, { useEffect } from "react";
import { auth } from "../auth";

const Auth: React.FC = () => {
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          await auth.sign(code);
        } else {
          window.location.href = "/";
        }
      } catch (error: any) {
        alert("Authentication failed: " + error.message);
      }
    };

    authenticateUser();
  }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default Auth;
