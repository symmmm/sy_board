import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import { Button, Pagination } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useLocation } from "react-router";
import config from "../../config/index";
const { SERVER_URI } = config;

const MyPage = () => {
  const location = useLocation();
  const history = useHistory();
  const back = () => {
    history.push("/main");
  };
  const [myData, setmyData] = useState([]);
  const [pageTotal, setpageTotal] = useState("");

  const UserName = location.state.username;

  useEffect(() => {
    axios
      .post(SERVER_URI + "/board/search/", {
        menuItem: "작성자",
        value: UserName,
        start_date: "0",
        end_date: "0",
        page: "1",
      })
      .then((response) => {
        setmyData(response.data.docs);
        setpageTotal(response.data.totalDocs);
        ////console.log(response.data.totalDocs);
      });
  }, [UserName]);

  const PageHandeler = (page) => {
    axios
      .get(SERVER_URI + "/board/search/", {
        menuItem: "작성자",
        value: UserName,
        start_date: "0",
        end_date: "0",
        page: page,
      })
      .then((response) => {
        setmyData(response.data.docs);
        setpageTotal(response.data.totalDocs);
        ////console.log(response.data.totalDocs);
      });
  };
  return (
    <div style={{ width: "1300px", margin: "0 auto" }}>
      <h3>내가 작성한 글</h3>
      <Table>
        <colgroup>
          <col width="10%" />
          <col width="50%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>추천수</th>
          </tr>
        </thead>
        <tbody>
          {myData.map((my, index) => (
            <tr key={index}>
              <td>{my.post_num}</td>

              <td>
                <Link to={`/posts/${my._id}?page=${1}`}>
                  [{my.post_fin_list.name}] {my.post_title} [
                  {my.post_comment.length}]
                </Link>
              </td>
              <td>{my.post_author}</td>
              <td>{dayjs(my.post_date).format("HH:mm")}</td>
              <td>{my.post_count}</td>
              <td>{my.post_recommend}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="page_box">
        <Button style={{ borderRadius: "2em" }} onClick={back}>
          돌아가기
        </Button>
        <Pagination
          total={pageTotal}
          onChange={PageHandeler}
          showSizeChanger={false}
        />
        <Link to="/posts" className="text-white text-decoration-none">
          <Button style={{ borderRadius: "2em", color: "rgba(236, 106, 23)" }}>
            글 작성
          </Button>
        </Link>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default MyPage;
