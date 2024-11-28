import React, { useState, useEffect } from "react";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  const [visible, setVisible] = useState(isLoading);
  const [opacity, setOpacity] = useState(isLoading ? 1 : 0);
  const [display, setDisplay] = useState(isLoading ? "flex" : "none");

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setOpacity(1); // 등장할 때 opacity를 1로 설정
      setDisplay("flex"); // 로딩 스피너가 표시될 때는 display를 flex로 설정
    } else {
      // isLoading이 false일 때 opacity를 0으로 설정하고, fade-out이 끝나면 display를 none으로 설정
      const timer = setTimeout(() => {
        setOpacity(0); // 사라질 때 opacity를 0으로 설정
      }, 0); // 0초 후에 opacity를 0으로 설정

      // fade-out 효과가 끝난 후 display를 none으로 변경
      const fadeOutEnd = () => {
        setDisplay("none"); // fade-out 후 display를 none으로 설정
      };

      // transitionend 이벤트가 끝날 때 display를 none으로 설정
      const spinnerElement = document.getElementById("spinner");
      spinnerElement?.addEventListener("transitionend", fadeOutEnd);

      return () => {
        clearTimeout(timer);
        spinnerElement?.removeEventListener("transitionend", fadeOutEnd); // 이벤트 리스너 정리
      };
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      id="spinner"
      className={`loading-spinner fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 w-screen h-screen z-50 transition-opacity duration-300`}
      style={{ opacity, display }}
    >
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      <p className="absolute text-lg text-white">Loading...</p>
    </div>
  );
};

export default Loading;
