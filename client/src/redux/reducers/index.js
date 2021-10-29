import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import PageSearchReducer from "./PageReducer";
import ButtonReducer from "./ButtonReducer";
import NowReducer from "./NowpageReducer";
import BoardCountReducer from "./CountReducer";
import LikeCountReducer from "./commentCount";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    PageSearchReducer,
    ButtonReducer,
    NowReducer,
    BoardCountReducer,
    LikeCountReducer,
  });

export default createRootReducer;
