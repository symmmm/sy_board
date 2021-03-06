import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nowLIKECount } from "../../redux/reducers/commentCount";
import config from "../../config/index";
//import { Button } from "antd";
const { SERVER_URI } = config;

const Like = () => {
  const nowid = useParams();
  const [like, setlike] = useState();
  const dispatch = useDispatch();
  const { LikeCount } = useSelector((state) => state.LikeCountReducer);
  const likeclick = () => {
    axios
      .get(SERVER_URI + "/board/view/recommend/" + nowid.id)
      .then((response) => {
        SET_LIKE_COUNT(response.data.recommend_count);
        dispatch(nowLIKECount(response.data.recommend_count));
        if (like === -1) {
          alert("추천하셨습니다.");
        } else {
          alert("추천취소");
        }
      });
  };

  const [ID, setID] = useState("");
  useEffect(() => {
    axios.get(SERVER_URI + "/user_check").then((response) => {
      setID(response.data.userID);
    });
  }, [nowid]);

  //////////////////추천확인/////////////////////////////////////
  const [LIKE_COUNT, SET_LIKE_COUNT] = useState("");

  useEffect(() => {
    axios
      .get(SERVER_URI + "/board/view/update/" + nowid.id)
      .then((response) => {
        //console.log(response.data.list.post_recommend_user);
        SET_LIKE_COUNT(response.data.list.post_recommend);
        const index = response.data.list.post_recommend_user.findIndex(
          (aaa) => aaa.recommend_user === ID
        );

        setlike(index);
      });
  }, [nowid, LikeCount, ID]);

  return (
    <>
      <div className="like">
        {like === -1 ? (
          <div className="like_button">
            <FavoriteBorderIcon
              className="likeicon"
              onClick={likeclick}
              style={{ fontSize: "23px" }}
            />
            <span className="Like_count">
              좋아요<span>{LIKE_COUNT}</span>
            </span>
          </div>
        ) : (
          <div className="like_button">
            <FavoriteIcon
              className="onlikeicon"
              onClick={likeclick}
              style={{ fontSize: "23px" }}
            />
            <span className="Like_count">좋아요 {LIKE_COUNT}</span>
          </div>
        )}
      </div>
      <div></div>
    </>
  );
};

export default Like;
