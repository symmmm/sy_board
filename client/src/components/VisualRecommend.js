import React from "react";
import visualvideo from "../img/analysis.mp4";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { DeleteSearch } from "../redux/reducers/PageReducer";
const Visual = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const HomeButton = () => {
    dispatch(DeleteSearch());
    history.push("/main");
  };
  return (
    <div className="desk-visual">
      <div className="deskbasewrap">
        <div className="basewrap-text">
          <h2
            style={{ marginBottom: "2px", fontWeight: 500, fontSize: "28px" }}
            onClick={HomeButton}
          >
            종목토론게시판
          </h2>
          <span>종목토론게시판 입니다 ㅁㄴㅇㅁㄴㅇㅁㅇ</span>
          <span>
            종목토론게시판 입니다.종목토론게시판 입니다.ㅁㄴㅇㅁㄴㅇㄴ
          </span>
        </div>

        <video
          autoPlay
          muted
          loop
          src={visualvideo}
          style={{
            position: "relative",
            left: "955px",
            top: "-71px",
            width: "178px",
            height: "99px",
          }}
        ></video>
      </div>
    </div>
  );
};

export default Visual;
