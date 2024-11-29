import { useCallback } from "react"; // useCallback 임포트
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { auth } from "./auth";
import { staticData } from "./staticData";

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
    fetchListsData: useCallback(async (): Promise<void> => {
      dispatch({
        type: "SET_LOADING",
        value: true,
      });

      try {
        const response = await auth.api.get(
          `${staticData.endpoint}/lists?request=getLists`
        );

        if (response?.data.answer.lists) {
          dispatch({
            type: "SET_DATA_LISTS",
            value: response?.data.answer.lists,
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(
          "Error connecting to getLists: " +
            JSON.stringify(axiosError.response?.data || axiosError.message)
        );
      } finally {
        dispatch({
          type: "SET_LOADING",
          value: false,
        });
      }
    }, [dispatch]), // dispatch는 외부 의존성으로 넣어줍니다.
  };
};
