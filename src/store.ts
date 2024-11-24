// store.ts
import { configureStore } from "@reduxjs/toolkit";

const initialState = {
  mode: { loginButton: false },
  userInfo: null,
};

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, userInfo: action.value };
    case "SET_LOGIN_BUTTON":
      return {
        ...state,
        mode: {
          ...state.mode,
          loginButton: action.value, // loginButton 값 업데이트
        },
      };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: appReducer,
});
