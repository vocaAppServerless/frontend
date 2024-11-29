import { useDispatch } from "react-redux";

export const useFuncs = () => {
  const dispatch = useDispatch();

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
    showAlert: (message: string) => {
      console.log("Dispatching SET_ALERT");
      dispatch({ type: "SET_ALERT", value: true });
      console.log("Dispatching SET_ALERT_MESSAGE");
      dispatch({ type: "SET_ALERT_MESSAGE", message });
      setTimeout(() => {
        console.log("Hiding alert");
        dispatch({ type: "SET_ALERT", value: false });
      }, 3000);
    },
  };
};
