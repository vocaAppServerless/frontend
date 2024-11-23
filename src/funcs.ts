import { useDispatch, useSelector } from "react-redux";

export const useFuncs = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state);

  return {
    changeUserInfo: (userInfo: any) => {
      console.log("change user info");
      dispatch({ type: "SET_USER", value: userInfo });
    },
    getUserInfo: () => userInfo,
  };
};
