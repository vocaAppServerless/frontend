import React, { useEffect, useState } from "react";
import "./App.scss";
import TestZone from "./components/TestZone"; // TestZone 컴포넌트 import
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const Home = () => <h2>Home Page</h2>;
const About = () => <h2>About Page</h2>;

function App() {
  const [message, setMessage] = useState<string>("");

  const endpoint: string | undefined =
    process.env.REACT_APP_API_GATEWAY_ENDPOINT;
  const env: string | undefined = process.env.REACT_APP_ENV;

  useEffect(() => {
    setMessage("Welcome to the app!");
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="container_app">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
          <h1>Hello, Remember me project!</h1>
          {message && <div>{message}</div>}
          <p>{env}</p>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>

        {/* TestZone 컴포넌트에 endpoint 전달 */}
        <TestZone endpoint={endpoint} />
      </div>
    </Router>
  );
}

export default App;
