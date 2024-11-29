import React, { useEffect, useState } from "react";
import "./AlertModal.scss";

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false); // 처음에는 숨겨져 있다가 fade-in됨
  const [isFadingOut, setIsFadingOut] = useState(false); // fade-out 여부 추적

  useEffect(() => {
    // 처음에 fade-in
    setIsVisible(true);

    // 2.5초 후에 fade-out 시작
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true); // fade-out 상태로 전환
    }, 2500); // 2.5초 후에 fade-out 시작

    // fade-out이 완료된 후 onClose 호출
    const completeFadeOutTimer = setTimeout(() => {
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
