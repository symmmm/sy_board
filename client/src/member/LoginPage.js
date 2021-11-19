import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginButton, logoutButton } from "../redux/reducers/ButtonReducer";
import "./css/LoginCSS.css";
import config from "../config/index";
const { LOGIN_URI } = config;
const { SERVER_URI } = config;
function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [Id, setId] = useState("");
  const [Password, setPassword] = useState("");

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onLOGIN_Handler = () => {
    if (Id.length < 5) {
      alert("아이디는 5자 이상입력하세요");
    } else if (Password < 6) {
      alert("비밀번호는 6자 이상입력하세요");
    } else {
      axios
        .post(LOGIN_URI, {
          request: {
            mb_id: Id,
            mb_password: Password,
          },
        })
        .then((response) => {
          if (response.data.code === 200) {
            //console.log(response.data.result.data.userId);
            axios
              .post(SERVER_URI + "/login", {
                userName: response.data.result.data.me.username,
                userID: response.data.result.data.userId,
              })
              .then((response) => {
                console.log(response.data);
                sessionStorage.setItem("user_Token", response.data);
                dispatch(loginButton());
                history.push("/main");
              });
          } else {
            alert("아이디 또는 비밀번호를 확인해주세요");
          }
        });
    }
  };

  const logout = () => {
    sessionStorage.clear();
    history.push("/");
    dispatch(logoutButton());
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      ////console.log(e.key);
      onLOGIN_Handler();
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "60vh",
      }}
    >
      {sessionStorage.getItem("user_Token") ? (
        <div>
          이미 로그인되어 있습니다.
          <br></br>
          <Button onClick={logout}>로그아웃하기</Button>
        </div>
      ) : (
        <div className="loginBox">
          <h2 style={{ textAlign: "center" }}>졸업작품</h2>
          <h2 style={{ textAlign: "center" }}>LOGIN</h2>
          <input
            className="loginWrap"
            type="text"
            placeholder="ID"
            onChange={onIdHandler}
            onKeyPress={onKeyPress}
          />

          <input
            className="loginWrap"
            type="password"
            placeholder="PW"
            value={Password}
            onChange={onPasswordHandler}
            onKeyPress={onKeyPress}
          />
          <button className="loginButton2" onClick={onLOGIN_Handler}>
            LOG IN
          </button>
          <div className="logingArea">
            <a
              href="https://www.hitalktv.com/loginId.do"
              target="_blank"
              rel="noreferrer noopenner"
            >
              아이디찾기
            </a>{" "}
            ㅣ
            <a
              href="https://www.hitalktv.com/loginPwd.do"
              target="_blank"
              rel="noreferrer noopenner"
            >
              비밀번호찾기
            </a>
            ㅣ
            <a
              href="https://www.hitalktv.com/memberReg.do"
              target="_blank"
              rel="noreferrer noopenner"
            >
              회원가입
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
export default LoginPage;
