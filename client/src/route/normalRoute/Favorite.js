import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  pageupdate,
  fincode_update,
  PageSearch,
} from "../../redux/reducers/PageReducer";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Button, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Base64 } from "js-base64";
import Chart from "../../components/chart";
import config from "../../config/index";
const { SERVER_URI } = config;
const { FINCODE_URI } = config;

const Favorite = React.memo(() => {
  const dispatch = useDispatch();
  const [Codedata, setCodeData] = useState([]);
  const [CodeInput, setCodeInput] = useState();
  const [MyCode, setMycode] = useState([]);
  //////////종목선택하기///////////////
  useEffect(() => {
    axios.get(FINCODE_URI).then((response) => {
      setCodeData(response.data.datalist);
    });
  }, []);

  const onCodeHandler = (event, newValue) => {
    setCodeInput(newValue);
    //////console.log(newValue);
  };

  ////////관심종목 추가, 삭제/////////
  const favorite_Button = () => {
    if (CodeInput) {
      axios
        .post(SERVER_URI + "/fin_interest/insert", {
          fin_interest_data: CodeInput,
        })
        .then((res) => {
          const result = res.data.fin_interest_insert_result;
          if (result === 0) {
            alert("이미 관심종목 리스트에 추가되어있습니다.");
          } else {
            axios.get(SERVER_URI + "/fin_interest/view").then((response) => {
              ////console.log(response.data.fin_interest_data);
              setMycode(response.data?.fin_interest_data);
            });
          }
        });
    } else {
      alert("관심종목을 선택해주세요");
    }
  };

  const Delete_Button = (code) => {
    axios
      .post(SERVER_URI + "/fin_interest/delete", {
        fin_interest_code: code,
      })
      .then(() => {
        axios.get(SERVER_URI + "/fin_interest/view").then((response) => {
          ////console.log(response.data.fin_interest_data);
          setMycode(response.data.fin_interest_data);
        });
      });
    ////console.log(code);
  };
  ////////////종목 누르면 리스트 바꾸기/////////////////
  const [total_UPpercent, set_total_UPpercent] = useState("");
  const [total_Downpercent, set_total_Downpercent] = useState("");
  const fincode_redux_data = useSelector(
    (state) => state.PageSearchReducer.fincode
  );

  const finList_Button = (finname) => {
    //////console.log(finname);
    //setcheck_code(finname);
    dispatch(PageSearch("종목명", finname));
    dispatch(fincode_update(finname));
    dispatch(pageupdate(1));
  };
  //////////////투표 정보//////////////
  const [check, setcheck] = useState("");
  const [minus_check, minus_setcheck] = useState("");
  useEffect(() => {
    axios
      .post(SERVER_URI + "/finance/info", {
        finance_name: fincode_redux_data,
      })
      .then((response) => {
        const header = window.sessionStorage.getItem("user_Token");
        const array = header.split(".");
        const userID = JSON.parse(Base64.decode(array[1])).userID;
        //console.log(userID);

        if (fincode_redux_data) {
          const index = response.data.finance_Up_Count_User;
          const index_check = index.findIndex((g) => g === userID);
          setcheck(index_check);
          ////console.log("투표확인 안했으면 -1 ", index_check);
          const minus_index = response.data.finance_Down_Count_User;
          const minus_index_check = minus_index.findIndex((h) => h === userID);
          minus_setcheck(minus_index_check);
          ////console.log("하락 투표확인 안했으면 -1 ", minus_index_check);
        }

        set_total_UPpercent(
          Math.round(
            (response.data.finance_Up_Count /
              (response.data.finance_Up_Count +
                response.data.finance_Down_Count)) *
              100
          )
        );
        set_total_Downpercent(
          100 -
            Math.round(
              (response.data.finance_Up_Count /
                (response.data.finance_Up_Count +
                  response.data.finance_Down_Count)) *
                100
            )
        );
      });
    return () => {
      setcheck("");
      minus_setcheck("");
      set_total_Downpercent("");
      set_total_UPpercent("");
      //////console.log("리스트 언마운트");
    };
  }, [fincode_redux_data]);

  ///////////나락극락///////////////////////
  const Up_Button = () => {
    axios
      .post(SERVER_URI + "/finance/up", {
        finance_name: fincode_redux_data,
      })
      .then(() => {
        setcheck(0);
        axios
          .post(SERVER_URI + "/finance/info", {
            finance_name: fincode_redux_data,
          })
          .then((response) => {
            set_total_UPpercent(
              Math.round(
                (response.data.finance_Up_Count /
                  (response.data.finance_Up_Count +
                    response.data.finance_Down_Count)) *
                  100
              )
            );
            set_total_Downpercent(
              100 -
                Math.round(
                  (response.data.finance_Up_Count /
                    (response.data.finance_Up_Count +
                      response.data.finance_Down_Count)) *
                    100
                )
            );
          });
      });
  };

  const Down_Button = () => {
    axios
      .post(SERVER_URI + "/finance/down", {
        finance_name: fincode_redux_data,
      })
      .then(() => {
        minus_setcheck(0);
        axios
          .post(SERVER_URI + "/finance/info", {
            finance_name: fincode_redux_data,
          })
          .then((response) => {
            //////console.log(response.data.finance_Down_Count);
            set_total_UPpercent(
              Math.round(
                (response.data.finance_Up_Count /
                  (response.data.finance_Up_Count +
                    response.data.finance_Down_Count)) *
                  100
              )
            );
            set_total_Downpercent(
              100 -
                Math.round(
                  (response.data.finance_Up_Count /
                    (response.data.finance_Up_Count +
                      response.data.finance_Down_Count)) *
                    100
                )
            );
          });
      });
  };

  ////////////종목보기/////////////////////////////

  useEffect(() => {
    axios.get(SERVER_URI + "/fin_interest/view").then((response) => {
      setMycode(response.data.fin_interest_data);
    });
  }, []);

  //////////////////////추천확인

  return (
    <div className="favorite">
      <div className="favorite_input">
        <Autocomplete
          onChange={onCodeHandler}
          options={Codedata}
          getOptionLabel={(option) => option.name + "ㅣ" + option.code}
          style={{ width: 250 }}
          renderInput={(params) => (
            <TextField
              label="관심종목을 선택하세요"
              {...params}
              margin="normal"
            />
          )}
        />
        <div>
          <Button
            onClick={() => {
              favorite_Button();
            }}
          >
            추가
          </Button>
        </div>
        <Divider
          className="titledivider"
          style={{ marginBottom: "5px", marginTop: "5px" }}
        ></Divider>
        <div>내 관심종목</div>
        <div className="favorite_list">
          {MyCode.map((aaa, index) => {
            return (
              <div key={index}>
                <div className="my_list">
                  <span
                    onClick={() => {
                      finList_Button(aaa.name);
                    }}
                  >
                    {aaa.name}ㅣ{aaa.code}{" "}
                  </span>
                  <CloseOutlined
                    onClick={() => {
                      Delete_Button(aaa.code);
                    }}
                  ></CloseOutlined>
                </div>
              </div>
            );
          })}
        </div>

        {fincode_redux_data ? (
          <>
            <div style={{ fontWeight: "600" }}>
              종목명 : {fincode_redux_data}
            </div>
            <div className="vote">
              <div
                className="vote-inline-graph up"
                style={{ width: `${total_UPpercent}%` }}
              >
                {total_UPpercent}%
              </div>
              <div
                className="vote-inline-graph down"
                style={{ width: `${total_Downpercent}%` }}
              >
                {total_Downpercent}%
              </div>
            </div>
            <div className="favorite_btn_wrap">
              {check === -1 ? (
                <Button onClick={Up_Button}>상승타이밍</Button>
              ) : (
                <span></span>
              )}
              {minus_check === -1 ? (
                <Button onClick={Down_Button}>하락타이밍</Button>
              ) : (
                <span></span>
              )}
            </div>
            <Chart />
          </>
        ) : (
          ""
        )}
      </div>
      <br></br>
    </div>
  );
});

export default React.memo(Favorite);
