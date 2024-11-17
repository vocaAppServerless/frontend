import React, { useEffect } from "react";
import "./App.css";

function App() {
  // GET 요청을 보낼 함수
  useEffect(() => {
    // localhost:3000/user로 GET 요청 보내기
    fetch("http://localhost:3000/user")
      .then((response) => response.json()) // JSON 형태로 응답 받기
      .then((data) => {
        console.log(data); // 콘솔에 데이터 출력
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  return (
    <div className="App">
      <div> hello Remember me project!</div>
    </div>
  );
}

export default App;
