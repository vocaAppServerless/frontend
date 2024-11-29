import React, { useEffect } from "react";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./store";
import { useDispatch, useSelector } from "react-redux";

// import { staticData } from "./staticData";

// icons
import { IoIosLogOut, IoIosListBox } from "react-icons/io";
import { MdOutlineEventNote } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";

import TestZone from "./components/TestZone";
import Home from "./components/Home";
import Lists from "./components/Lists";
import IncorrectLists from "./components/IncorrectLists";
import ErrorBoundary from "./components/ErrorBoundary"; // 방금 만든 ErrorBoundary 컴포넌트
import Auth from "./components/Auth"; // Auth.tsx 컴포넌트 임포트
import AlertModal from "./components/small/AlertModal"; // AlertModal 임포트
import Loading from "./components/small/Loading"; // 컴포넌트 import

const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isSign = useSelector((state: any) => state.mode.isSign);
  const isLoading = useSelector((state: any) => state.mode.isLoading);
  const { mode, alertMessage } = useSelector((state: any) => state);

  const getNavItemClass = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  // userInfo가 null 또는 undefined인 경우 대체값을 설정
  const userInfo = useSelector((state: any) => state.userInfo);

  // auth 초기화가 완료되었는지 확인하는 함수

  useEffect(() => {
    const handleRouteChange = () => {
      console.log(`Current Path: ${location.pathname}`);
    };
    handleRouteChange();
  }, [location]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const picture = localStorage.getItem("picture");

    // email과 picture이 존재할 때만 상태를 업데이트
    if (email && picture) {
      const userInfo = { email, picture };
      dispatch({ type: "SET_USER_INFO", value: userInfo });
    }
  }, [dispatch]);

  const handleSignOut = () => {
    localStorage.clear();

    dispatch({ type: "SET_USER_INFO", value: null });
    dispatch({ type: "SET_DATA", value: {} });

    window.location.reload();
  };

  return (
    <div className="App">
      <div className="container_app">
        {isLoading && <Loading isLoading={isLoading} />}

        {mode.isAlert && (
          <AlertModal message={alertMessage} onClose={() => {}} />
        )}
        <nav className="nav_top">
          <div className=" flex items-center text-white font-bold text-2xl sm:text-3xl lg:text-4xl">
            <MdOutlineEventNote className="mr-2" />
            <p
              className="tracking-in-expand hidden sm:block " // 작은 화면에서 숨기고, sm 이상 크기에서 보이게
              style={{
                fontFamily: "kanit",
                fontWeight: "bold",
              }}
            >
              Remember me
            </p>
          </div>
          <p>version 1.0.1</p>

          {userInfo && userInfo.email ? (
            <div className="flex items-center space-x-4 ml-auto">
              <img
                className="h-[30px] w-[30px] rounded-full border-2 border-white shadow-md"
                src={userInfo.picture || ""}
                alt="User Profile"
              />
              <div className="text-white font-semibold">
                <p>{userInfo.email}</p> {/* 이메일을 출력 */}
              </div>
              {!isSign ? null : (
                <IoIosLogOut
                  className="text-white text-3xl font-bold"
                  onClick={handleSignOut}
                />
              )}
            </div>
          ) : (
            <div className="text-white text-lg font-semibold ml-auto flex items-center space-x-2">
              <p>로그인 하세여</p>
            </div>
          )}
        </nav>

        <nav className="slide-in-bck-center nav_bot flex justify-around items-center w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-4 fixed bottom-0 left-0 z-50">
          <div
            className={`nav_item flex items-center space-x-2 ${getNavItemClass(
              "/"
            )}`}
          >
            <Link to="/" className="flex items-center space-x-2 bounce-top">
              <AiOutlineHome className="text-white text-2xl" />
              <span className="text-white hidden sm:block">Home</span>{" "}
              {/* 작은 화면에서는 숨기고, sm 이상에서는 보이게 */}
            </Link>
          </div>

          <div
            className={`nav_item flex items-center space-x-2 ${getNavItemClass(
              "/wordlists"
            )}`}
          >
            <Link
              to="/wordlists"
              className="flex items-center space-x-2 bounce-top"
            >
              <FaList className="text-white text-2xl" />
              <span className="text-white hidden sm:block">
                Word Lists
              </span>{" "}
              {/* 작은 화면에서는 숨기고, sm 이상에서는 보이게 */}
            </Link>
          </div>

          <div
            className={`nav_item flex items-center space-x-2 ${getNavItemClass(
              "/incorrectlists"
            )}`}
          >
            <Link
              to="/incorrectlists"
              className="flex items-center space-x-2 bounce-top"
            >
              <IoIosListBox className="text-white text-2xl" />
              <span className="text-white hidden sm:block">
                Incorrect Lists
              </span>{" "}
              {/* 작은 화면에서는 숨기고, sm 이상에서는 보이게 */}
            </Link>
          </div>
        </nav>

        <div className="router_screen">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wordlists" element={<Lists />} />
              <Route path="/incorrectlists" element={<IncorrectLists />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </ErrorBoundary>
          <TestZone />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
