import React from "react";
import { useSelector } from "react-redux";
import { useFuncs } from "../funcs";

const IncorrectLists = () => {
  // const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state);
  const funcs = useFuncs();

  return (
    <div className="container_wordlists">
      <h2>Incorrect Word List Page</h2>
      <p>{userInfo.picture}</p>

      <button
        onClick={() => {
          funcs.changeUserInfo("muzzi");
        }}
      >
        유저바꾸기 함수
      </button>
    </div>
  );
};

export default IncorrectLists;
