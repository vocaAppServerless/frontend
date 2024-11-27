import { useDispatch, useSelector } from "react-redux";

export const useFuncs = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state);
  console.log(userInfo);
  return {
    changeUserInfo: (userInfo: any) => {
      console.log("change user info");
      dispatch({ type: "SET_USER", value: userInfo });
    },
    logOut: () => {
      console.log("log out");
      dispatch({ type: "SET_USER", value: null });
      dispatch({ type: "SET_DATA", value: null });
      localStorage.clear();
    },
  };
};
