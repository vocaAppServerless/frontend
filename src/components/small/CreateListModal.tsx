import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CreateListModal.scss";
import { useFuncs } from "../../funcs";
import { auth } from "../../auth";
import { staticData } from "../../staticData";

interface CreateListModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [language, setLanguage] = useState<string>("en");
  const [listName, setListName] = useState<string>("");
  const state = useSelector((state: any) => state);
  const dispatch = useDispatch();

  const { showAlert } = useFuncs();

  // 모달이 열릴 때마다 listName을 초기화
  useEffect(() => {
    if (isOpen) {
      setListName(""); // 모달이 열릴 때마다 name을 리셋
    }
  }, [isOpen]);

  const handleAddList = async () => {
    if (listName.trim() && language.trim()) {
      const data = {
        name: listName,
        language: language,
      };
      console.log(data);

      try {
        // API 요청을 보내는 부분
        const response = await auth.api.post(
          `${staticData.endpoint}/list?request=putList`, // 경로는 적절하게 수정 가능
          {
            ...data, // 이름과 언어를 포함한 데이터
          }
        );

        // 응답 처리
        if (response.status === 200 || response.status === 201) {
          console.log("응답코드 : ", response.status);
          console.log("응답데이터 : ", response.data);
          // 받은 list 객체를 data.lists에 추가
          const newList = response.data.answer.list;
          // 기존 lists 배열 복사하고 새 list 추가
          const updatedLists = [...state.data.lists, newList];

          // 새로운 lists 배열로 SET_DATA_LISTS 액션 디스패치
          dispatch({
            type: "SET_DATA_LISTS",
            value: updatedLists,
          });
          showAlert(`${listName} list is added!`);
          closeModal();
        } else {
          console.log("419에러도 여기서 잡아");
        }
      } catch (error) {
        // 오류 처리
        console.error("create list API error:", error);
        showAlert("Something wrong..");
      }
    } else {
      showAlert("Write new list's name!");
    }
  };

  // 모달이 열려있을 때만 표시
  if (!isOpen) return null;

  return (
    <div className="create-list-modal-overlay" onClick={closeModal}>
      <div
        className="create-list-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-list-modal-header">
          <h3>Let's add a new list!</h3>
          <button className="close-btn" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="create-list-modal-body">
          <label htmlFor="list-name">New List Name</label>
          <input
            id="list-name"
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Type the new list's name"
          />

          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="jp">Japanese</option>
            {/* 다른 언어 옵션 추가 가능 */}
          </select>
        </div>
        <div className="create-list-modal-footer">
          <button onClick={handleAddList} className="add-btn">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;
