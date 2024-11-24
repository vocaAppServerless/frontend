import React, { useEffect } from "react";
import "./Home.scss";
import { auth } from "../auth";
import { useDispatch, useSelector } from "react-redux";

type GoogleLoginButtonProps = {
  onClick: () => void;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => (
  <button className="google-login-btn" onClick={onClick}>
    <img
      src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
      alt="Google logo"
      className="google-logo"
    />
    <span>Login with Google</span>
  </button>
);

const Home = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      localStorage.clear();
      dispatch({ type: "SET_LOGIN_BUTTON", value: true });
    } else {
      //둘다 있다면
      //여기서도 조건으로 해당 토큰들을 api요청보내서 유효한 토큰인지 체크.
      dispatch({ type: "SET_LOGIN_BUTTON", value: false });
    }
  }, [dispatch]);

  return (
    <div className="container_home">
      <p>here is home!</p>
      <p>here is home!</p>
      <p>{JSON.stringify(state.userInfo)}</p>

      {/* 구글 로그인 버튼 */}
      {state.mode.loginButton && (
        <GoogleLoginButton
          onClick={() => {
            auth.joinGoogleOauthUrl();
          }}
        />
      )}
    </div>
  );
};

export default Home;
