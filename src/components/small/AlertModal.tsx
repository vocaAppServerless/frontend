import React, { useEffect, useState } from "react";
import "./AlertModal.scss";

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false); // 처음에는 숨겨져 있다가 fade-in됨
  const [isFadingOut, setIsFadingOut] = useState(false); // fade-out 여부 추적
  const [isHidden, setIsHidden] = useState(false); // alert가 완전히 숨겨졌는지 추적

  useEffect(() => {
    // 처음에 fade-in
    setIsVisible(true);

    // 2.5초 후에 fade-out 시작
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true); // fade-out 상태로 전환
    }, 2500); // 2.5초 후에 fade-out 시작

    // fade-out이 완료된 후 onClose 호출
    const completeFadeOutTimer = setTimeout(() => {
      setIsHidden(true); // fade-out 완료 후 display: none 처리
      onClose(); // fade-out 완료 후 onClose 호출
    }, 3000); // 3초 후 onClose 호출

    // clean-up
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeFadeOutTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`alert-modal-overlay ${isVisible ? "show" : "hide"} ${
        isFadingOut ? "fade-out" : ""
      }`}
      style={{
        pointerEvents: isFadingOut || isHidden ? "none" : "auto", // fade-out 후 pointer-events 설정
        display: isHidden ? "none" : "flex", // alert가 숨겨지면 display: none 적용
      }}
    >
      <div
        className={`alert-modal ${isVisible ? "show" : "hide"} ${
          isFadingOut ? "fade-out" : ""
        }`}
      >
        <div className="alert-message">{message}</div>
      </div>
    </div>
  );
};

export default AlertModal;
