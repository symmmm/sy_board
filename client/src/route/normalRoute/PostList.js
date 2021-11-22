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
//import { DeletNoWid } from "../../redux/reducers/NowpageReducer";
import dayjs from "dayjs";
import config from "../../config/index";
import Searchhistory from "../../components/Searchhistory";
//import useOutsideClick from "../../components/useOutsideClick";
const { SERVER_URI } = config;
const { Search } = Input;
//import { nowpaging } from "../../redux/reducers/NowpageReducer";

const PostList = () => {
  const nowid = useParams();
  const search_ref = useRef();
  const ref = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [pageTotal, setpageTotal] = useState("");
  const [getMenu, setMenu] = useState("제목");
  const [getCategory, setCategory] = useState("전체글");
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
  const { LikeCount } = useSelector(
    (state) => state.LikeCountReducer,
    shallowEqual
  );

  ////////////////리스트 받아오기///////////////////
  useEffect(() => {
    console.log("이펙트실행");
    if (SearchList) {
      axios
        .post(SERVER_URI + "/board/search/", {
          menuItem: SelectMenu,
          value: searchValue,
          start_date: "0",
          end_date: "0",
          page: Reduxpage,
        })
        .then((response) => {
          setData(response.data?.docs);
          setpageTotal(response?.data.totalDocs);
          const fin_list_code = response?.data.docs.map(
            (v) => v.post_fin_list.code
          );
          axios
            .post(SERVER_URI + "/board/countBoard", {
              fin_code_list: fin_list_code,
            })
            .then((res) => {
              const int_v = res.data?.countBoard.map((a) => a.fin_count);
              set_interest(int_v);
              set_interest_total(res.data.countBoard[0]?.total_count);
            });
        });
    } else if (Best_List) {
      if (Best_List === "추천수") {
        console.log("추천수");
        axios
          .get(SERVER_URI + "/board/desc/like/" + Reduxpage)
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
      } else if (Best_List === "조회수") {
        console.log("조회수");
        axios
          .get(SERVER_URI + "/board/desc/view/" + Reduxpage)
          .then((response) => {
            setData(response.data.docs);
            console.log(response.data.docs);
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
      } else if (Best_List === "인기종목") {
        axios
          .get(SERVER_URI + "/board/desc/attention/" + Reduxpage)
          .then((response) => {
            const array = response.data.boards.docs.map((a) => a.boards_object);
            setData(array);
            setpageTotal(response.data.boards?.totalDocs);
            const fin_list_code = array.map((v) => v.post_fin_list.code);
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
    } else {
      axios.get(SERVER_URI + "/board/list/" + Reduxpage).then((response) => {
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
    }
    return () => {};
  }, [
    searchValue,
    LikeCount,
    commentCount,
    Best_List,
    Reduxpage,
    postCount,
    SearchList,
  ]);

  //////////////////////페이지 변경 ///////////////////
  const PageHandeler = (page) => {
    dispatch(pageupdate(page));
    if (SearchList) {
      axios
        .post(SERVER_URI + "/board/search/", {
          menuItem: SelectMenu,
          value: searchValue,
          start_date: "0",
          end_date: "0",
          page: page,
        })
        .then((response) => {
          setpageTotal(response.data?.totalDocs);
          setData(response.data?.docs);
        });
    } else {
      axios.get(SERVER_URI + "/board/list/" + page).then((response) => {
        setpageTotal(response.data.totalDocs);
        setData(response.data.docs);
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
    set_Show_history(false);
    if (value.length > 15) {
      alert("검색어는 15자 이하입니다");
    } else if (value === "") {
      alert("검색어를 입력해주세요");
    } else if (value.length <= 15) {
      axios
        .post(SERVER_URI + "/board/search/", {
          menuItem: getMenu,
          value: value,
          start_date: "0",
          end_date: "0",
          page: "1",
        })
        .then((response) => {
          setData(response.data?.docs);
          setpageTotal(response.data?.totalDocs);
          dispatch(PageSearch(getMenu, value));
          axios
            .post(SERVER_URI + "/search_log/save", {
              Search_Type: getMenu,
              Search_Value: value,
            })
            .then((res) => {
              console.log(res?.data);
            });
        });
    } else {
      alert("검색할 내용을 입력하세요.");
      dispatch(DeleteSearch());
    }
  };

  ////////////////홈버튼
  const HomeButton = () => {
    //dispatch(DeletNoWid());
    dispatch(DeleteSearch());
    setMenu("제목");
    search_ref.current.state.value = "";
    history.push("/main");
    window.scrollTo(0, 0);
  };

  const [click_auth, set_click_auth] = useState();
  function auth_Click(value) {
    set_click_auth(value);
  }
  function auth_MenuClick() {
    dispatch(PageSearch("작성자", click_auth));
  }
  function fincode_Click(value) {
    dispatch(PageSearch("종목명", value));
  }
  const auth_menu = (
    <Menu>
      <Menu.Item key="작성자" onClick={auth_MenuClick}>
        작성글 보기
      </Menu.Item>
    </Menu>
  );
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="제목">제목</Menu.Item>
      <Menu.Item key="작성자">작성자</Menu.Item>
      <Menu.Item key="내용">내용</Menu.Item>
      <Menu.Item key="종목명">종목명</Menu.Item>
      <Menu.Item key="종목코드">종목코드</Menu.Item>
    </Menu>
  );
  function handleMenuClick(e) {
    console.log(e.key);
    setMenu(e.key);
  }
  function handleCategoryClick(e) {
    console.log(e.key);
    setCategory(e.key);
  }
  const best = (e) => {
    dispatch(update_best("추천수"));
    dispatch(pageupdate(1));
    window.scrollTo(0, 0);
  };
  const best_count = () => {
    dispatch(update_best("조회수"));
    dispatch(pageupdate(1));
    window.scrollTo(0, 0);
  };
  const best_fin = () => {
    dispatch(update_best("인기종목"));
    dispatch(pageupdate(1));
    window.scrollTo(0, 0);
  };

  const category_menu = (
    <Menu onClick={handleCategoryClick}>
      <Menu.Item key="전체글" onClick={HomeButton}>
        전체글
      </Menu.Item>
      <Menu.Item key="추천수" onClick={best}>
        추천수
      </Menu.Item>
      <Menu.Item key="조회수" onClick={best_count}>
        조회수
      </Menu.Item>
      <Menu.Item key="인기종목" onClick={best_fin}>
        인기종목
      </Menu.Item>
    </Menu>
  );

  ///////////////검색내역
  const [Show_history, set_Show_history] = useState(false);
  const search_click = (e) => {
    //console.log("타켓", ref.current.contains(e.target));
    //console.log("인풋포커스", search_ref.current.state.focused);
    if (search_ref.current.state.focused === false) {
      if (ref.current.contains(e.target)) {
        return;
      }
      set_Show_history(false);
    }
  };
  useEffect(() => {
    //console.log("머하는놈이냐");
    document.addEventListener("click", search_click);
    return () => {
      document.removeEventListener("click", search_click);
    };
  }, []);

  return (
    <div className="Main_LIST">
      <Table>
        <colgroup>
          <col width="10%" />
          <col width="15%" />
          <col width="35%" />
          <col width="10%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>{""}</th>
            <th style={{ textAlign: "left", paddingLeft: "100px" }}>제목</th>
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
                <span
                  className="list_fincodename"
                  onClick={() => {
                    fincode_Click(user.post_fin_list.name);
                  }}
                >
                  {user.post_fin_list.name}
                </span>
              </td>
              <td style={{ textAlign: "left", paddingLeft: "50px" }}>
                <Link to={`/posts/${user._id}?page=${Reduxpage}`}>
                  {user.post_title} [{user.post_comment.length}]
                </Link>
              </td>
              <td>
                <Dropdown overlay={auth_menu} trigger={["click"]}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => auth_Click(user.post_author)}
                  >
                    {user.post_author}
                  </span>
                </Dropdown>
              </td>
              {dayjs().format("YYYY-MM-DD") <=
              dayjs(user.post_date).format("YYYY-MM-DD") ? (
                <td>{dayjs(user.post_date).format("HH:mm")}</td>
              ) : (
                <td>{dayjs(user.post_date).format("MM.DD")}</td>
              )}

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
          {/* <Button style={{ marginRight: "2px" }} onClick={HomeButton}>
            전체글
          </Button> */}
          <Dropdown overlay={category_menu} trigger="click">
            <Button>
              {getCategory} <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <Pagination
          className="paging"
          current={Reduxpage}
          onChange={PageHandeler}
          total={pageTotal}
          showSizeChanger={false}
        />
        <Link to="/posts" className="text-white text-decoration-none">
          <Button>글쓰기</Button>
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
          onClick={() => set_Show_history(!Show_history)}
        ></Search>
      </div>
      <div className="hhh" ref={ref}>
        {Show_history ? <Searchhistory /> : ""}
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
