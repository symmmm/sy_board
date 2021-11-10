import React, { useState, useEffect } from "react";
import { Typography, Divider, Button, Modal } from "antd";
import { Input } from "reactstrap";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import axios from "axios";
import { useHistory, useParams, Link } from "react-router-dom";
import Main from "./MainPage";
import { AlertOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { DeletNoWid } from "../../redux/reducers/NowpageReducer";
import { DeleteSearch, fincode_update } from "../../redux/reducers/PageReducer";
//import { nowpaging } from "../../redux/reducers/NowpageReducer";
import { nowCount, postCount } from "../../redux/reducers/CountReducer";
import Like from "./Like";
import Report from "../../components/Report";
import config from "../../config/index";

const { SERVER_URI } = config;
const { Title } = Typography;

const PostDetail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [C_ModalVisible, setC_ModalVisible] = useState(false);
  const [CC_ModalVisible, setCC_ModalVisible] = useState(false);
  const [C_DeleteID, set_C_DeleteID] = useState();
  const [CC_commentid, set_CC_commentid] = useState();
  const [CC_recommentid, set_CC_recommentid] = useState();
  const nowid = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  //const pagenowid = useSelector((state) => state.NowReducer);
  /////////삭제모달///////////
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    submitDelete();
    alert("삭제 완료!");
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  ////////댓글삭제모달////////////////
  const show_C_Modal = (comment_id) => {
    setC_ModalVisible(true);
    set_C_DeleteID(comment_id);
  };
  const C_handleOk = () => {
    setC_ModalVisible(false);
    cDelete(C_DeleteID);
  };
  const C_handleCancel = () => {
    setC_ModalVisible(false);
  };
  ////////////답글삭제모달///////////////
  const show_CC_Modal = (commentid, recommentid) => {
    setCC_ModalVisible(true);
    set_CC_commentid(commentid);
    set_CC_recommentid(recommentid);
  };
  const CC_handleOk = () => {
    setCC_ModalVisible(false);
    set_CC_commentid(CC_commentid);
    set_CC_recommentid(CC_recommentid);
    ccDelete(CC_commentid, CC_recommentid);
  };
  const CC_handleCancel = () => {
    setCC_ModalVisible(false);
  };
  ///////삭제////////////////////////////////////////
  const submitDelete = () => {
    axios
      .delete(SERVER_URI + "/board/" + nowid.id, {
        headers: { authorization: sessionStorage.getItem("user_Token") },
      })
      .then((response) => {
        ////console.log(response);
        history.push("/main");
      });
  };
  /////// 페이지 내용 받아오기//////////////////////////////////////
  const { LikeCount } = useSelector((state) => state.LikeCountReducer);
  const [data, setData] = useState({});
  const [Cdata, setCdata] = useState([]);
  const [titlecode, settitlecode] = useState("");
  useEffect(() => {
    axios.get(SERVER_URI + "/board/view/" + nowid.id).then((response) => {
      settitlecode(response.data.list.post_fin_list);
      setCdata(response.data.list.post_comment);
      setData(response.data.list);
      window.scrollTo(0, 0);
      console.log(response.data.list.post_comment.length);
      //dispatch(nowpaging(nowid.id));
      dispatch(postCount(response.data.list.post_count));
      dispatch(fincode_update(response.data.list.post_fin_list.name));
    });
    return () => {
      //console.log("리스트 언마운트");
      dispatch(fincode_update());
      //dispatch(nowpaging());
    };
  }, [nowid]);
  /////리덕스이용해서 추천수올리기
  useEffect(() => {
    axios
      .get(SERVER_URI + "/board/view/update/" + nowid.id)
      .then((response) => {
        setData(response.data.list);
        //console.log(response.data.list.post_count);
        //////console.log("좋아요 갯수",response.data.list.post_recommend)
        ////console.log("좋아요 갯수 업데이트");
      });
  }, [LikeCount]);

  //////////////자기글만 삭제 수정하기//////////////
  const [UserName, setUserName] = useState("");
  useEffect(() => {
    axios.get(SERVER_URI + "/user_check").then((response) => {
      //////console.log(response.data.userName)
      setUserName(response.data.userName);
    });
  }, [nowid]);
  //////////////////////////댓글 작성/////////////////////////////
  const [WriteComment, setWriteComment] = useState("");
  const [WriteReComment, setWriteReComment] = useState("");
  const cWrite = () => {
    if (WriteComment === "") {
      alert("댓글을 입력해주세요");
    } else {
      axios
        .post(SERVER_URI + "/board/comment", {
          board_id: nowid.id,
          comment_content: WriteComment,
        })
        .then(() => {
          //////console.log(response.data);
          setWriteComment("");
          dispatch(nowCount(Cdata.length));
          axios
            .get(SERVER_URI + "/board/view/update/" + nowid.id)
            .then((response) => {
              //////console.log(response.data.list);
              setCdata(response.data.list.post_comment);
              alert("댓글 작성 완료");
            });
        });
    }
  };
  ///////////////////////답글 작성/////////////////////////////////
  const RCwrite = (id) => {
    if (WriteReComment === "") {
      alert("답글을 입력해주세요");
    } else {
      axios
        .post(SERVER_URI + "/board/recomment", {
          board_id: nowid.id,
          comment_id: id,
          recomment_content: WriteReComment,
        })
        .then(() => {
          axios
            .get(SERVER_URI + "/board/view/update/" + nowid.id)
            .then((response) => {
              ////console.log(response.data.list);
              setCdata(response.data.list.post_comment);
            });
          alert("답글 작성 완료");
          setWriteReComment("");
        });
    }
  };
  ///////////////////댓글 삭제///////////////////////////
  const cDelete = (comment_id) => {
    axios
      .delete(SERVER_URI + "/board/comment/" + comment_id, {
        headers: { authorization: sessionStorage.getItem("user_Token") },
      })
      .then(() => {
        ////console.log(response);
        dispatch(nowCount(Cdata.length));
        axios
          .get(SERVER_URI + "/board/view/update/" + nowid.id)
          .then((response) => {
            setCdata(response.data.list.post_comment);
          });
      });
  };
  ////////////////////답글삭제//////////////////////////////
  const ccDelete = (commentid, recommentid) => {
    axios
      .delete(
        SERVER_URI +
          "/board/recomment" +
          "/" +
          nowid.id +
          "/" +
          commentid +
          "/" +
          recommentid
      )
      .then(() => {
        axios
          .get(SERVER_URI + "/board/view/update/" + nowid.id)
          .then((response) => {
            setCdata(response.data.list.post_comment);
          });
      });
  };

  ////////////////////////
  const ReCommentHandler = (e) => {
    setWriteReComment(e.target.value);
  };
  const CommentHandler = (e) => {
    setWriteComment(e.target.value);
    //////console.log(e.target.value);
  };
  /////////////////////////////홈으로 갑시다/////////
  const HomeButton = () => {
    dispatch(DeletNoWid());
    dispatch(DeleteSearch());
    history.push("/main");
  };

  //////////////////답글///////////////////////////////////////////////////
  const [openRecomment, setopenRecomment] = useState(false);
  const [commentID, setcommentID] = useState();

  const reButton = (id) => {
    setopenRecomment(!openRecomment);
    setcommentID(id);
  };
  ///////////////////////댓글추천////////////////////////
  const ClikeClick = (commentid) => {
    axios
      .post(SERVER_URI + "/board/comment/recommend", {
        board_id: nowid.id,
        comment_id: commentid,
      })
      .then(() => {
        axios
          .get(SERVER_URI + "/board/view/update/" + nowid.id)
          .then((response) => {
            setCdata(response.data.list.post_comment);
          });
      });
  };
  //////////////////////답글추천///////////////
  const CClikeClick = (commentid, recommentid) => {
    axios
      .post(SERVER_URI + "/board/recomment/recommend", {
        board_id: nowid.id,
        comment_id: commentid,
        recomment_id: recommentid,
      })
      .then(() => {
        axios
          .get(SERVER_URI + "/board/view/update/" + nowid.id)
          .then((response) => {
            setCdata(response.data.list.post_comment);
          });
      });
  };
  ////////////////////////////////////////

  return (
    <div style={{ width: "1300px", margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <Title onClick={HomeButton}>토론게시판</Title>
        <Divider className="titledivider" />
      </div>
      <div className="TitleName">
        <h4>
          [{titlecode.name}] {data.post_title}
        </h4>
      </div>
      <div className="DetailHeader">
        <div className="TitleAuthor">
          {data.post_author} ㅣ{" "}
          {dayjs(data.post_date).format("YYYY.MM.DD HH:mm:ss")}
        </div>
        <div>
          조회수:{data.post_count} ㅣ 추천수:{data.post_recommend} ㅣ댓글수:
          {Cdata.length}
        </div>
      </div>
      <Divider className="titledivider" />
      <div
        className="detail"
        dangerouslySetInnerHTML={{ __html: data.post_content }}
      ></div>
      <div className="detail_button_wrap">
        <Like username={UserName} />
        {UserName === data.post_author ? (
          <div>
            <Link to={`/edit/${data._id}`}>
              <Button
                style={{
                  marginLeft: "1px",
                  borderRadius: "2em",
                  color: "rgba(236, 106, 23)",
                }}
              >
                수정
              </Button>
            </Link>
            <Button
              onClick={showModal}
              style={{ marginLeft: "1px", borderRadius: "2em" }}
            >
              삭제
            </Button>
          </div>
        ) : (
          <Report
            report_title={data.post_title} //제목
            bad_user={data.post_author} //신고유저
            report_user={UserName} //신고자
            board_id={nowid.id} //게시글아이디
          />
        )}
      </div>
      <Divider className="divider" />
      <span className="commnet_count">{Cdata.length}</span>
      <span style={{ fontWeight: "600" }}>개의 댓글</span>
      {Cdata.map((aaa, index) => (
        <div className="comment_box" key={index}>
          <span style={{ fontWeight: "bold" }}>{aaa.comment_author}</span>
          <span style={{ marginLeft: "6px", color: "rgba(136, 136, 136)" }}>
            {dayjs(aaa.comment_date).format("MM-DD HH:mm")}
          </span>
          <div
            className="comment_wrap"
            style={{
              color: "rgba(80, 80, 80)",
              marginBottom: "5px",
              fontSize: "15px",
            }}
          >
            <span onClick={() => reButton(aaa._id)}>{aaa.comment_content}</span>
            <div className="like_button" style={{ fontSize: "15px" }}>
              {aaa.comment_recommend_user.findIndex(
                (a) => a.comment_recommend_user === UserName
              ) === 0 ? (
                <FavoriteIcon
                  className="onlikeicon"
                  style={{ fontSize: "18px" }}
                  onClick={() => {
                    ClikeClick(aaa._id);
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  className="likeicon"
                  style={{ fontSize: "18px" }}
                  onClick={() => {
                    ClikeClick(aaa._id);
                  }}
                />
              )}{" "}
              {aaa.comment_recommend}
              {aaa.comment_author === UserName ? (
                <span
                  className="comment_delete"
                  onClick={() => {
                    show_C_Modal(aaa._id);
                  }}
                >
                  삭제
                </span>
              ) : (
                <AlertOutlined className="report_btn" />
              )}
            </div>
          </div>
          {aaa.comment_recomment.map((bbb, index) => (
            <div className="recomment_box" key={index}>
              <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
                └ {bbb.recomment_author}
              </span>
              <span style={{ marginLeft: "6px", color: "rgba(136, 136, 136)" }}>
                {dayjs(bbb.recomment_date).format("MM-DD HH:mm")}
              </span>
              <div
                className="comment_wrap"
                style={{
                  color: "rgba(80, 80, 80)",
                  marginLeft: "30px",
                  marginRight: "140px",
                  fontSize: "15px",
                }}
              >
                <span>{bbb.recomment_content}</span>
                <div className="like_button" style={{ fontSize: "15px" }}>
                  {" "}
                  {bbb.recomment_recommend_user.findIndex(
                    (b) => b.recomment_recommend_user === UserName
                  ) === 0 ? (
                    <FavoriteIcon
                      className="onlikeicon"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        CClikeClick(aaa._id, bbb._id);
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className="likeicon"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        CClikeClick(aaa._id, bbb._id);
                      }}
                    />
                  )}{" "}
                  {bbb.recomment_recommend}
                  {bbb.recomment_author === UserName ? (
                    <span
                      className="comment_delete"
                      onClick={() => {
                        show_CC_Modal(aaa._id, bbb._id);
                      }}
                    >
                      삭제
                    </span>
                  ) : (
                    <AlertOutlined className="report_btn" />
                  )}
                </div>
              </div>
            </div>
          ))}
          {openRecomment ? (
            commentID === aaa._id ? (
              <div>
                <Input
                  type="textarea"
                  value={WriteReComment}
                  placeholder="답글을 입력해주세요"
                  onChange={ReCommentHandler}
                  style={{ width: "1150px" }}
                />
                <Button onClick={() => RCwrite(aaa._id)}>답글쓰기</Button>
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
      ))}
      {/* <Table>
        <colgroup>
          <col width="10%" />
          <col width="70%" />
          <col width="7%" />
          <col width="9%" />
        </colgroup>
        <tbody className="Commentsbody">
          {Cdata.map((aaa, index) => (
            <tr key={index}>
              <td>{aaa.comment_author}</td>
              <td>
                <div onClick={() => reButton(aaa._id)}>
                  {aaa.comment_content}
                </div>
                {openRecomment ? (
                  commentID === aaa._id ? (
                    <div>
                      <Input
                        type="textarea"
                        value={WriteReComment}
                        placeholder="답글을 입력해주세요"
                        onChange={ReCommentHandler}
                      />
                      <Button onClick={() => RCwrite(aaa._id)}>답글쓰기</Button>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                <Table className="recommentTable">
                  <colgroup>
                    <col width="10%" />
                    <col width="60%" />
                    <col width="11%" />
                    <col width="13%" />
                  </colgroup>
                  <tbody className="recommenttable">
                    {aaa.comment_recomment.map((bbb, index) => (
                      <tr key={index}>
                        <td>└ {bbb.recomment_author}</td>
                        <td>{bbb.recomment_content}</td>
                        <td className="likebox">
                          {" "}
                          <Button
                            className="commentlike"
                            onClick={() => {
                              CClikeClick(aaa._id, bbb._id);
                            }}
                          >
                            {bbb.recomment_recommend_user.findIndex(
                              (b) => b.recomment_recommend_user === UserName
                            ) === 0 ? (
                              <LikeFilled className="onlike" />
                            ) : (
                              <LikeFilled />
                            )}{" "}
                            : {bbb.recomment_recommend}
                          </Button>
                        </td>
                        <td>{bbb.recomment_date}</td>
                        <td>
                          {bbb.recomment_author === UserName ? (
                            <CloseOutlined
                              onClick={() => {
                                show_CC_Modal(aaa._id, bbb._id);
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
              <td>
                {" "}
                <Button
                  className="commentlike"
                  onClick={() => {
                    ClikeClick(aaa._id);
                  }}
                >
                  {aaa.comment_recommend_user.findIndex(
                    (a) => a.comment_recommend_user === UserName
                  ) === 0 ? (
                    <LikeFilled className="onlike" />
                  ) : (
                    <LikeFilled />
                  )}{" "}
                  : {aaa.comment_recommend}
                </Button>
              </td>
              <td>{dayjs(aaa.comment_date).format("MM.DD HH:mm:ss")}</td>

              <td>
                {aaa.comment_author === UserName ? (
                  <CloseOutlined
                    onClick={() => {
                      show_C_Modal(aaa._id);
                    }}
                  />
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}
      <Input
        className="commentbox"
        type="textarea"
        placeholder="댓글을 입력해주세요"
        value={WriteComment}
        onChange={CommentHandler}
      />
      <div className="detail_button_wrap">
        {" "}
        <Button style={{ borderRadius: "2em" }} onClick={cWrite}>
          댓글쓰기
        </Button>
      </div>
      <Main />
      <Modal
        title="게시글"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="삭제"
        cancelText="취소"
      >
        <p>정말 삭제하시겠습니까?</p>
      </Modal>
      <Modal
        title="댓글"
        visible={C_ModalVisible}
        onOk={C_handleOk}
        onCancel={C_handleCancel}
        okText="삭제"
        cancelText="취소"
      >
        <p>정말 삭제하시겠습니까?</p>
      </Modal>
      <Modal
        title="답글"
        visible={CC_ModalVisible}
        onOk={CC_handleOk}
        onCancel={CC_handleCancel}
        okText="삭제"
        cancelText="취소"
      >
        <p>정말 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
};

export default PostDetail;
