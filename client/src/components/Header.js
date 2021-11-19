import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { logoutButton } from "../redux/reducers/ButtonReducer";
import config from "../config/index";
import youtube_banner from "../img/youtube_banner.png";
import hitalk_logo from "../img/logo.png";
import kakaoplus_banner from "../img/kakaoplus-banner.jpg";
import login_icon from "../img/icon-id.png";
import Topbanner from "./Topbanner";
import Event from "./Event";
import Visual from "./VisualRecommend";
const { SERVER_URI } = config;

const Header = () => {
  const { logoutstate } = useSelector((state) => state.ButtonReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Nickname, setNickname] = useState("");
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

  useEffect(() => {
    if (logoutstate) {
      axios.get(SERVER_URI + "/user_check").then((response) => {
        //console.log(response.data);
        setNickname(response.data.userName);
      });
    }
  }, [logoutstate]);

  const mypage = () => {
    axios.get(SERVER_URI + "/user_check").then((response) => {
      //console.log(response.data.userName);
      const UserName = response.data.userName;
      history.push({
        pathname: "/mypage",
        state: { username: UserName },
      });
      ////console.log("usercheck", UserName);
    });
  };

  //////////////////로그아웃/////////////
  const logout = () => {
    sessionStorage.clear();
    history.push("/");
    dispatch(logoutButton());
  };

  return (
    <div>
      <Topbanner />
      <div
        style={{
          backgroundColor: "white",
          height: "100px",
          borderBottom: "1px solid #dadada",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div className="header-wrap">
          <div style={{ display: "flex" }}>
            <div className="image_box" style={{ paddingTop: "9px" }}>
              <a
                href="https://www.hitalktv.com/maingo.do"
                target="_blank"
                rel="noreferrer noopenner"
              >
                <img alt="hitalk_logo" src={hitalk_logo}></img>
              </a>
            </div>
          </div>
          <Event />
          <div style={{ display: "flex" }}>
            <div className="login_box">
              {logoutstate ? (
                <div className="login_wrap">
                  <span className="login_image">
                    <img
                      alt="login_icon"
                      src={login_icon}
                      style={{
                        width: "15px",
                        height: "15px",
                        marginLeft: "5px",
                      }}
                    ></img>
                  </span>
                  <div className="login_1">{Nickname}님 환영합니다.</div>
                  <button className="logout_btn" onClick={mypage}>
                    MYpage
                  </button>
                  <button className="logout_btn" onClick={showModal}>
                    로그아웃
                  </button>
                </div>
              ) : (
                "로그인이 필요한 서비스입니다"
              )}
            </div>
            <div
              className="image_box"
              style={{
                paddingTop: "14px",
                zIndex: "10",
                width: "180px",
                position: "relative",
                left: "25px",
              }}
            >
              <img
                alt="kakaoplus_banner"
                src={kakaoplus_banner}
                style={{
                  width: "180px",
                  height: "85px",
                }}
              ></img>
            </div>
            <div className="image_box">
              <img
                alt="youtube_banner"
                src={youtube_banner}
                style={{
                  width: "224px",
                  height: "85px",
                }}
              ></img>
            </div>
          </div>
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
      <Visual />
    </div>
  );
};

export default Header;
