import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaRegStickyNote } from "react-icons/fa";
import "./WordListBoxHome.scss"; // SCSS 파일 import

interface WordListBoxProps {
  name: string;
  creation_date: string;
  language: string;
  linked_incorrect_word_lists: any[]; // 배열의 타입 구체화 필요하면 수정
  is_bookmark: boolean;
}

const WordListBoxHome: React.FC<WordListBoxProps> = ({
  name,
  creation_date,
  language,
  linked_incorrect_word_lists,
  is_bookmark,
}) => {
  // 화면 크기 상태 관리 (모바일 감지)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  // 화면 크기 변경 시 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // language 값에 따라 출력할 이미지 링크 설정
  const flagImage =
    language === "en"
      ? "https://raw.githubusercontent.com/lipis/flag-icons/e119b66129af6dd849754ccf25dfbf81d4a306d5/flags/1x1/us.svg"
      : language === "jp"
      ? "https://raw.githubusercontent.com/lipis/flag-icons/e119b66129af6dd849754ccf25dfbf81d4a306d5/flags/1x1/jp.svg"
      : "";

  return (
    <div className="word-card">
      {isMobile ? (
        <div className="word-card-body">
          <div
            className="word-card-flag"
            style={{ backgroundImage: `url(${flagImage})` }}
          ></div>
          <div className="word-card-info">
            <h3 className="word-card-title">{name}</h3>
            <p className="word-card-date">{creation_date}</p>
            <div className="word-card-footer">
              <div className="word-card-icons">
                {linked_incorrect_word_lists.map((_, index) => (
                  <FaRegStickyNote key={index} className="icon-sticky-note" />
                ))}
              </div>
              <span className={`icon-bookmark ${is_bookmark ? "filled" : ""}`}>
                {is_bookmark ? <FaStar /> : <FaRegStar />}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // 데스크탑 화면일 때의 내용 렌더링
        <div className="word-card-body">
          <div
            className="word-card-flag"
            style={{ backgroundImage: `url(${flagImage})` }}
          ></div>
          <h3 className="word-card-title">{name}</h3>
          <p className="word-card-date">{creation_date}</p>
          <div className="word-card-footer">
            <div className="word-card-icons">
              {linked_incorrect_word_lists.map((_, index) => (
                <FaRegStickyNote key={index} className="icon-sticky-note" />
              ))}
            </div>
            <span className={`icon-bookmark ${is_bookmark ? "filled" : ""}`}>
              {is_bookmark ? <FaStar /> : <FaRegStar />}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordListBoxHome;
