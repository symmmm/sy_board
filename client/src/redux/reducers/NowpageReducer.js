import { UPDATE_NOWID,DELETE_NOWID } from "../type";


export const nowpaging = (pagenowid) => ({
  type: UPDATE_NOWID,
  payload: { id: pagenowid },
});

export const DeletNoWid = () => ({
  type: DELETE_NOWID
});

const initialState = {
  pagenowid: "",
};

const NowReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NOWID:
      return {
        ...state,
        pagenowid: action.payload.id,
      };
      case DELETE_NOWID:
        return {
          ...state,
          pagenowid:"",
        };

    default:
      return { ...state };
  }
};

export default NowReducer;
