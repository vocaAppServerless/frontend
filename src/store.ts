// store.ts
import { configureStore } from "@reduxjs/toolkit";

const initialState = {
  mode: { isSign: false, isLoading: false },
  userInfo: null,
  data: {},
};

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.value,
        mode: {
          ...state.mode,
          isSign: Boolean(action.value), // userInfo가 null이 아니면 true, null이면 false
        },
      };
    case "SET_SIGN":
      return {
        ...state,
        mode: {
          ...state.mode,
          isSign: action.value, // loginButton 값 업데이트
        },
      };
    case "SET_DATA":
      return { ...state, data: action.value };
    case "SET_DATA_LISTS": // 리스트 데이터를 업데이트하는 액션
      return { ...state, data: { ...state.data, lists: action.value } };
    case "SET_LOADING": // isLoading 상태를 업데이트하는 액션
      return {
        ...state,
        mode: {
          ...state.mode,
          isLoading: action.value,
        },
      };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: appReducer,
});
