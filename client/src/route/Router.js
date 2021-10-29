import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNavbar from "../components/AppNavbar";
import { Switch, Route } from "react-router-dom";
import PostWrite from "./normalRoute/PostWrite";
import PostDetail from "./normalRoute/PostDetail";
import LoginPage from "../member/LoginPage";
import PostEdit from "./normalRoute/PostEdit";
import PrivateRoute from "./PrivateRouter/PrivateRouter";
import MyPage from "./normalRoute/MyPage";
import Main from "./normalRoute/MainPage";

const MyRouter = () => (
  <Fragment>
    <AppNavbar />
    <Header />
    <Switch>
      <Route path="/" exact component={LoginPage} />
      <PrivateRoute path="/main" exact component={Main} />
      <PrivateRoute path="/posts" exact component={PostWrite} />
      <PrivateRoute path="/posts/:id" exact component={PostDetail} />
      <PrivateRoute path="/edit/:id" exact component={PostEdit} />
      <PrivateRoute path="/mypage" exact component={MyPage} />
    </Switch>
    <Footer />
  </Fragment>
);

export default MyRouter;
