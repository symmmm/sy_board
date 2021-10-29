import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";
import MyRouter from "./route/Router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/custom.scss";
import "./App.css";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = sessionStorage.getItem("user_Token");
    return config;
  },
  function (error) {
    console.log("에러", error);
    return Promise.reject(error);
  }
);

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MyRouter />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
