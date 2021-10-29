import { LikeFilled } from "@ant-design/icons";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nowLIKECount } from "../../redux/reducers/commentCount";
import { Button } from "antd";
import config from "../../config/index";
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
        ////console.log(response.data.recommend_count);
        SET_LIKE_COUNT(response.data.recommend_count);
        dispatch(nowLIKECount(response.data.recommend_count));
        if (like === -1) {
          alert("추천하셨습니다.");
        } else {
          alert("추천취소");
        }
      });
  };

  const [Nickname, setNickname] = useState("");
  useEffect(() => {
    axios.get(SERVER_URI + "/user_check").then((response) => {
      setNickname(response.data.userName);
      ////console.log(response.data.userName);
    });
  }, [nowid]);

  //////////////////추천확인/////////////////////////////////////
  const [LIKE_COUNT, SET_LIKE_COUNT] = useState("");

  useEffect(() => {
    axios
      .get(SERVER_URI + "/board/view/update/" + nowid.id)
      .then((response) => {
        ////console.log(response.data.list.post_recommend_user)
        SET_LIKE_COUNT(response.data.list.post_recommend);
        const index = response.data.list.post_recommend_user.findIndex(
          (aaa) => aaa.recommend_user === Nickname
        );

        setlike(index);
        ////console.log("추천확인 -1이면 안누름", index);
      });
  }, [nowid, LikeCount, Nickname]);

  return (
    <>
      <div className="like">
        {like === -1 ? (
          <Button className="BigLike" onClick={likeclick}>
            <LikeFilled className="likeicon" />:{LIKE_COUNT}
          </Button>
        ) : (
          <Button className="BigLike" onClick={likeclick}>
            <LikeFilled className="onlikeicon" />:{LIKE_COUNT}
          </Button>
        )}
      </div>
      <div></div>
    </>
  );
};

export default Like;
