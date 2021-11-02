import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import axios from "axios";
import { Link, useHistory, useParams } from "react-router-dom";
import { Table } from "reactstrap";
import { Menu, Dropdown, Button, Pagination, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  PageSearch,
  pageupdate,
  update_best,
  DeleteSearch,
} from "../../redux/reducers/PageReducer";
import { DeletNoWid } from "../../redux/reducers/NowpageReducer";
import dayjs from "dayjs";
import config from "../../config/index";
const { SERVER_URI } = config;
const { Search } = Input;
//import { nowpaging } from "../../redux/reducers/NowpageReducer";

const PostList = () => {
  const nowid = useParams();
  const search_ref = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [pageTotal, setpageTotal] = useState("");
  const [getMenu, setMenu] = useState("제목");
  const [interest, set_interest] = useState("");
  const [interest_total, set_interest_total] = useState("");
  const { SearchList, SelectMenu, searchValue, Reduxpage, Best_List } =
    useSelector(
      (state) => ({
        SearchList: state.PageSearchReducer.SearchList,
        SelectMenu: state.PageSearchReducer.SelectMenu,
        searchValue: state.PageSearchReducer.searchValue,
        Reduxpage: state.PageSearchReducer.Reduxpage,
        Best_List: state.PageSearchReducer.Best_List,
      }),
      shallowEqual
    );
  //const pagenowid = useSelector((state) => state.NowReducer.pagenowid);
  const { commentCount, postCount } = useSelector(
    (state) => ({
      commentCount: state.BoardCountReducer.CommentCount,
      postCount: state.BoardCountReducer.postCount,
    }),
    shallowEqual
  );
  //console.log(postCount);
  const { LikeCount } = useSelector(
    (state) => state.LikeCountReducer,
    shallowEqual
  );
  //////console.log(Best_List)

  ////////////////리스트 받아오기///////////////////
  useEffect(() => {
    console.log("이펙트실행");
    if (SearchList) {
      axios
        .get(
          SERVER_URI +
            "/board/search/" +
            SelectMenu +
            "/" +
            searchValue +
            "/" +
            Reduxpage
        )
        .then((response) => {
          //console.log("검색or관심종목클릭");
          setData(response.data.docs);
          setpageTotal(response.data.totalDocs);
          const fin_list_code = response.data.docs.map(
            (v) => v.post_fin_list.code
          );
          axios
            .post(SERVER_URI + "/board/countBoard", {
              fin_code_list: fin_list_code,
            })
            .then((res) => {
              const int_v = res.data.countBoard.map((a) => a.fin_count);
              set_interest(int_v);
              set_interest_total(res.data.countBoard[0]?.total_count);
            });
        });
    } else if (Best_List === true) {
      axios
        .get(SERVER_URI + "/board/list/best/" + Reduxpage)
        .then((response) => {
          setData(response.data.docs);
          setpageTotal(response.data.totalDocs);
          const fin_list_code = response.data.docs.map(
            (v) => v.post_fin_list.code
          );
          axios
            .post(SERVER_URI + "/board/countBoard", {
              fin_code_list: fin_list_code,
            })
            .then((res) => {
              const int_v = res.data.countBoard.map((a) => a.fin_count);
              set_interest(int_v);
              set_interest_total(res.data.countBoard[0]?.total_count);
            });
        });
    } else {
      axios.get(SERVER_URI + "/board/list/" + Reduxpage).then((response) => {
        setData(response.data.docs);
        //console.log(response.data.docs);
        setpageTotal(response.data.totalDocs);
        const fin_list_code = response.data.docs.map(
          (v) => v.post_fin_list.code
        );
        axios
          .post(SERVER_URI + "/board/countBoard", {
            fin_code_list: fin_list_code,
          })
          .then((res) => {
            const int_v = res.data.countBoard.map((a) => a.fin_count);
            set_interest(int_v);
            set_interest_total(res.data.countBoard[0]?.total_count);
          });
      });
    }
    return () => {};
  }, [searchValue, LikeCount, commentCount, Best_List, Reduxpage, postCount]);

  //////////////////////페이지 변경 ///////////////////
  const PageHandeler = (page) => {
    dispatch(pageupdate(page));
    if (SearchList) {
      axios
        .get(
          SERVER_URI +
            "/board/search/" +
            SelectMenu +
            "/" +
            searchValue +
            "/" +
            page
        )
        .then((response) => {
          ////console.log(page);
          setpageTotal(response.data.totalDocs);
          setData(response.data.docs);
          //setPage(page);
        });
    } else {
      axios.get(SERVER_URI + "/board/list/" + page).then((response) => {
        //////console.log(response.data);
        setpageTotal(response.data.totalDocs);
        setData(response.data.docs);
        //setPage(page);
      });
    }
  };
  ////////////////////////페이지 유지///////////////
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const getParamsPage = params.get("page");
  //   ////console.log(getParamsPage)
  //   if (getParamsPage) {
  //     //setPage(parseInt(getParamsPage));
  //     PageHandeler(parseInt(getParamsPage))
  //   }
  // }, []);

  ////////////////////////////////검색//////////////////////////

  const onSearch = (value) => {
    if (value) {
      axios
        .get(SERVER_URI + "/board/search/" + getMenu + "/" + value + "/1")
        .then((response) => {
          const List = response.data.docs;
          setData(List);
          setpageTotal(response.data.totalDocs);
          dispatch(PageSearch(getMenu, value));
        });
    } else {
      alert("검색할 내용을 입력하세요.");
      dispatch(DeleteSearch());
    }
  };

  ////////////////홈버튼
  const HomeButton = () => {
    dispatch(DeletNoWid());
    dispatch(DeleteSearch());
    setMenu("제목");
    search_ref.current.state.value = "";
    history.push("/main");
    window.scrollTo(0, 0);
  };

  function handleMenuClick(e) {
    setMenu(e.key);
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="제목">제목</Menu.Item>
      <Menu.Item key="작성자">작성자</Menu.Item>
      <Menu.Item key="내용">내용</Menu.Item>
      <Menu.Item key="종목명">종목명</Menu.Item>
      <Menu.Item key="종목코드">종목코드</Menu.Item>
    </Menu>
  );
  const [click_auth, set_click_auth] = useState();
  function auth_Click(value) {
    set_click_auth(value);
  }
  function auth_MenuClick() {
    dispatch(PageSearch("작성자", click_auth));
  }
  const auth_menu = (
    <Menu>
      <Menu.Item key="작성자" onClick={auth_MenuClick}>
        작성글 보기
      </Menu.Item>
    </Menu>
  );

  const best = () => {
    dispatch(update_best());
    dispatch(pageupdate(1));
    window.scrollTo(0, 0);
  };
  //////////////////////작성자 클릭///////////////////////

  return (
    <div className="Main_LIST">
      <Table>
        <colgroup>
          <col width="10%" />
          <col width="50%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>추천수</th>
            <th>관심도</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user, index) => (
            <tr key={index}>
              {nowid.id === user._id ? (
                <td className="now">현재글</td>
              ) : (
                <td>{user.post_num}</td>
              )}
              <td>
                <Link to={`/posts/${user._id}?page=${Reduxpage}`}>
                  [{user.post_fin_list.name}] {user.post_title} [
                  {user.post_comment.length}]
                </Link>
              </td>
              <td>
                <Dropdown overlay={auth_menu} trigger={["click"]}>
                  <span onClick={() => auth_Click(user.post_author)}>
                    {user.post_author}
                  </span>
                </Dropdown>
              </td>
              <td>{dayjs(user.post_date).format("HH:mm")}</td>
              <td>{user.post_count}</td>
              <td>{user.post_recommend}</td>
              <td
                id={
                  Math.round((interest[index] / interest_total) * 100) >= 30
                    ? "red"
                    : ""
                }
              >
                {interest_total === 0
                  ? 0
                  : Math.round((interest[index] / interest_total) * 100)}
                %
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="page_box">
        <div>
          <Button onClick={HomeButton} style={{ marginRight: "2px" }}>
            전체글
          </Button>
          <Button onClick={best}>인기글</Button>
        </div>

        <Pagination
          current={Reduxpage}
          onChange={PageHandeler}
          total={pageTotal}
          showSizeChanger={false}
        />
        <Link to="/posts" className="text-white text-decoration-none">
          <Button type="primary">글 작성</Button>
        </Link>
      </div>
      <br></br>
      <div className="search_box">
        <Dropdown overlay={menu} trigger="click">
          <Button>
            {getMenu} <DownOutlined />
          </Button>
        </Dropdown>{" "}
        <Search
          ref={search_ref}
          placeholder="내용을 입력하세요"
          onSearch={onSearch}
          enterButton
        />
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default PostList;

///////////쓰다버린거
/*{<td>
{Math.round((interest[index] / interest_total) * 100) >= 30 ? (
  <span style={{ color: "red" }}>
    {Math.round((interest[index] / interest_total) * 100)}%
  </span>
) : (
  <span style={{ color: "black" }}>
    {Math.round((interest[index] / interest_total) * 100)}%
  </span>
)}
</td>}*/
