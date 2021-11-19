import { UPDATE_LOGIN_BUTTON, UPDATE_LOGOUT_BUTTON } from "../type";

export const loginButton = (Nickname) => ({
  type: UPDATE_LOGIN_BUTTON,
  payload: Nickname,
});
export const logoutButton = () => ({
  type: UPDATE_LOGOUT_BUTTON,
});

const initialState = {
  logoutstate: sessionStorage.getItem("user_Token") ? true : false,
  Nickname: "",
};

const ButtonReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGIN_BUTTON:
      return {
        ...state,
        logoutstate: true,
        Nickname: action.payload,
      };
    case UPDATE_LOGOUT_BUTTON:
      return {
        ...state,
        logoutstate: false,
      };
    default:
      return state;
  }
};

export default ButtonReducer;
