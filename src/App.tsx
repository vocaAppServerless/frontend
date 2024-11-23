import React, { useEffect } from "react";
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

const About = () => <h2>About Page</h2>;

const AppContent = () => {
  const location = useLocation(); // useLocation은 Router 내부에서 사용 가능

  useEffect(() => {
    // 경로 변경 시 실행될 함수
    const handleRouteChange = () => {
      console.log(`Current Path: ${location.pathname}`);
    };

    handleRouteChange(); // 경로가 변경될 때마다 실행
  }, [location]);

  const endpoint: string | undefined =
    process.env.REACT_APP_API_GATEWAY_ENDPOINT;

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
