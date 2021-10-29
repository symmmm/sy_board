import React, { useState } from "react";
import { Button } from "reactstrap";
import { Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { logoutButton } from "../redux/reducers/ButtonReducer";
import config from "../config/index";
const { SERVER_URI } = config;
const AppNavbar = () => {
  const { logoutstate } = useSelector((state) => state.ButtonReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    logout();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //const [UserName, setUserName] = useState("");

  const mypage = () => {
    axios.get(SERVER_URI + "/user_check").then((response) => {
      ////console.log(response.data.userName)
      const UserName = response.data.userName;
      history.push({
        pathname: "/mypage",
        state: { username: UserName },
      });
      //console.log("usercheck", UserName);
    });
  };

  //////////////////로그아웃/////////////
  const logout = () => {
    axios.get(SERVER_URI + "/logout").then((response) => {
      if (response.data.logout_result_code === 1) {
        sessionStorage.clear();
        dispatch(logoutButton());
        history.push("/");
      }
    });
  };
  return (
    <div style={{ backgroundColor: "#343a40" }}>
      <div className="toptop">
        {logoutstate ? <Button onClick={mypage}>Mypage</Button> : ""}

        {logoutstate ? (
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginLeft: "2px" }}
          >
            로그아웃
          </Button>
        ) : (
          <div className="loginButton">로그인이 필요한 서비스입니다.</div>
        )}
      </div>
      <Modal
        title="로그아웃"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="로그아웃"
        cancelText="취소"
      >
        <p>정말 로그아웃 하시겠습니까?</p>
      </Modal>
    </div>
  );
};

export default AppNavbar;
