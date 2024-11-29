import React, { useState, useEffect } from "react";
import "./Lists.scss";
import { useSelector } from "react-redux";
import WordListBox from "./small/WordListBox";
import Loading from "./small/Loading"; // 컴포넌트 import
import { useNavigate } from "react-router-dom"; // useNavigate import

import CreateListModal from "./small/CreateListModal"; // 새로운 모달 컴포넌트 import

//icons
import { FaPlus } from "react-icons/fa"; // FaPlus 아이콘 import

const Lists = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const state = useSelector((state: any) => state);
  const lists = useSelector((state: any) => state.data.lists);
  const isLoading = useSelector((state: any) => state.mode.isLoading);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  useEffect(() => {
    if (lists === null) {
      navigate("/");
    }
  }, [lists, navigate]); // lists가 변경될 때마다 실행

  const toggleCreateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container_lists">
      <Loading isLoading={isLoading} />
      <CreateListModal isOpen={isModalOpen} closeModal={toggleCreateModal} />

      {!isLoading && state.mode.isSign && (
        <div className="contents-lists">
          <div className="lists">
            {lists && lists.length > 0 ? (
              lists
                .filter((list: any) => !list.is_deleted) // is_deleted가 false인 항목만 필터링
                .sort(
                  (a: any, b: any) =>
                    new Date(b.creation_date).getTime() -
                    new Date(a.creation_date).getTime()
                ) // 최신순으로 정렬
                .map((list: any) => (
                  <WordListBox
                    key={list._id} // 각 컴포넌트에 고유한 key 값 추가
                    name={list.name}
                    creation_date={list.creation_date}
                    language={list.language}
                    linked_incorrect_word_lists={
                      list.linked_incorrect_word_lists
                    }
                    is_bookmark={list.is_bookmark}
                  />
                ))
            ) : (
              <p>No word lists</p>
            )}
          </div>
        </div>
      )}
      <div className="btns">
        <div className="btn" onClick={toggleCreateModal}>
          <FaPlus className="icon" />
        </div>
      </div>
    </div>
  );
};

export default Lists;
