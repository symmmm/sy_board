import { createStore, compose, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./redux/reducers/index";

export const history = createBrowserHistory();

const initialState = {};

const middlewares = [routerMiddleware(history)];

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancer =
  process.env.NODE_ENV === "production" ? compose : devtools || compose;

const store = createStore(
  createRootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(...middlewares))
);

export default store;
