import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import config from "../config/index";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PageSearch } from "../redux/reducers/PageReducer";
const { SERVER_URI } = config;

const Searchhistory = () => {
  const dispatch = useDispatch();
  const ref = useRef();
  const [search_history, set_search_history] = useState([]);
  useEffect(() => {
    console.log("이펙트실행");
    axios.get(SERVER_URI + "/search_log/find").then((response) => {
      //console.log(response.data.data);
      //const array_length = response.data.data.length;
      //console.log(response.data.data.slice(0, 5));
      const array = response.data.data.slice(0, 5);
      set_search_history(array);
    });
    return () => set_search_history([]);
  }, []);

  const click = (id) => {
    console.log("click", id);
    axios
      .post(SERVER_URI + "/search_log/delete", {
        search_log_id: id,
      })
      .then((res) => {
        console.log(res.data);
        axios.get(SERVER_URI + "/search_log/find").then((response) => {
          //console.log(response.data.data);
          //const array_length = response.data.data.length;
          //console.log(response.data.data.slice(0, 5));
          const array = response.data.data.slice(0, 5);
          set_search_history(array);
        });
      });
  };
  const histroy_click = (value, type) => {
    console.log(type, value);
    dispatch(PageSearch(type, value));
  };
  return (
    <div className="search_history">
      <div className="historybox" ref={ref}>
        <div className="history_wrap">
          <span
            style={{
              marginLeft: "15px",
              color: "grey",
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            최근검색어
          </span>
        </div>
        {search_history.length === 0 ? (
          <div style={{ marginTop: "50px" }}>최근 검색어 내용이 없습니다</div>
        ) : (
          search_history.map((aaa, index) => (
            <div className="history_wrap" key={index}>
              <span
                style={{
                  width: "939px",
                  textAlign: "left",
                }}
                onClick={() =>
                  histroy_click(
                    aaa.member_Search_List.search_value,
                    aaa.member_Search_List.search_type
                  )
                }
              >
                <span
                  style={{
                    marginLeft: "14px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span className="seach_icon">
                    <SearchOutlined
                      style={{
                        fontSize: "15px",
                        color: "white",
                      }}
                    />
                  </span>
                  {aaa.member_Search_List.search_value}
                </span>
              </span>
              <span className="date_span">
                {dayjs(aaa.member_Search_List.search_Date).format("MM.DD")}
                <CloseOutlined
                  style={{
                    marginLeft: "15px",
                    marginRight: "15px",
                    fontSize: "13px",
                  }}
                  onClick={() => click(aaa.member_Search_List._id)}
                />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Searchhistory;
