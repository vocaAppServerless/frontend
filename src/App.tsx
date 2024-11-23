import React, { useEffect, useState } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./store";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";

import TestZone from "./components/TestZone";
import Home from "./components/Home";
import WordLists from "./components/WordLists";
import Auth from "./components/Auth"; // Auth.tsx 컴포넌트 임포트
import { auth } from "./auth";

const About = () => <h2>About Page</h2>;

const AppContent = () => {
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const location = useLocation(); // useLocation은 Router 내부에서 사용 가능

  useEffect(() => {
    // 경로 변경 시 실행될 함수
    const handleRouteChange = () => {
      console.log(`Current Path: ${location.pathname}`);
      setMessage(`You are now on: ${location.pathname}`);
    };

    handleRouteChange(); // 경로가 변경될 때마다 실행
  }, [location]);

  const handleLoginClick = () => {
    // 로그인 버튼 클릭 시 로그인 로직 구현
    console.log("로그인 버튼 클릭");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const endpoint: string | undefined =
    process.env.REACT_APP_API_GATEWAY_ENDPOINT;
  const env: string | undefined = process.env.REACT_APP_ENV;

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container_app">
          <nav className="nav_top">
            <div>nav_top</div>
          </nav>
          <nav className="nav_bot">
            <div className="nav_item">
              <Link to="/">Home</Link>
            </div>
            <div className="nav_item">
              <Link to="/wordlists">Word Lists</Link>
            </div>
            <div className="nav_item">
              <Link to="/about">About</Link>
            </div>
          </nav>
          <div className="router_screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wordlists" element={<WordLists />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </div>
          <TestZone endpoint={endpoint} />
        </div>
      </div>
    </Provider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
