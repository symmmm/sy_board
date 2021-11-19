import { Button, Input } from "antd";
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import { useDispatch } from "react-redux";
import { DeleteSearch } from "../../redux/reducers/PageReducer";
import { DeletNoWid } from "../../redux/reducers/NowpageReducer";
import ReactQuill, { Quill } from "react-quill";
import config from "../../config/index";
import "react-quill/dist/quill.snow.css";
import Loading from "../../components/Loading";
import ImageResize from "quill-image-resize";
import VideoResize from "quill-video-resize-module2";
Quill.register("modules/ImageResize", ImageResize);
Quill.register("modules/VideoResize", VideoResize);
const { IMAGE_URI } = config;
const { SERVER_URI } = config;
const { FINCODE_URI } = config;

function PostWrite() {
  const quillRef = useRef();
  const fileRef = useRef();
  const [loading, setloading] = useState(false);
  const image_upload_click = () => fileRef.current.click();

  const imageHandler = (event) => {
    setloading(true);
    const file = event.target.files; // 데이터 만들어준다.
    const formData = new FormData();
    Object.values(file).forEach((file) => formData.append("imgs", file)); //formData.append("imgs", file); // formData는 키-밸류 구조
    formData.append("path", "community/board"); //path도 formdata에 넣어준다
    axios
      .post(IMAGE_URI, formData, {
        headers: {
          "Content-Type": `multipart/form-data; `,
        },
      })
      .then((response) => {
        console.log(response.data.code);
        if (response.data.code === "200") {
          //console.log("성공 시, 백엔드가 보내주는 데이터", response.data.images);
          const IMG_URL = response.data.images;
          ////console.log("배열이미지", IMG_URL.length);
          const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
          const range = editor.getSelection();
          for (var i = 0; i < IMG_URL.length; i++) {
            if (IMG_URL[i]) {
              editor.insertEmbed(range, "image", IMG_URL[i].imgurl);
              ////console.log("이미지삽입실행", IMG_URL[i].imgurl);
            }
          }
        } else if (response.data.code === "999") {
          alert("사진 업로드 실패");
        }
        setloading(false);
        event.target.value = "";
      });
  };
  ////////////////////////////////////////////////////////////////////
  const [Codedata, setCodeData] = useState([]);
  const dispatch = useDispatch();
  ////////////////////////////////////////////////종목코드 받아오기///////////////
  useEffect(() => {
    axios.get(FINCODE_URI).then((response) => {
      const CodeList = response.data.datalist;
      setCodeData(CodeList);
    });
  }, []);
  /////////////////////////////////////////////글작성/////////////////
  const history = useHistory();
  const [CodeInput, setCodeInput] = useState();
  const [ContentData, setContentData] = useState("");
  const [Title, setTitle] = useState();
  const submitReview = () => {
    if (Title.length >= 16) {
      alert("제목의 길이는 15글자 이하로 설정해주세요");
    } else if (CodeInput && ContentData && Title) {
      axios
        .post(
          SERVER_URI + "/board/insert",
          {
            board_title: Title,
            board_Data: ContentData,
            board_item: CodeInput,
          },
          {
            headers: { authorization: sessionStorage.getItem("user_Token") },
          }
        )
        .then((response) => {
          if (response.data.board_insert === 1) {
            if (checked) {
              axios
                .post(SERVER_URI + "/fin_interest/insert", {
                  fin_interest_data: CodeInput,
                })
                .then((res) => {
                  console.log(res);
                });
            }
            alert("글 작성 완료");
            dispatch(DeletNoWid());
            dispatch(DeleteSearch());
            history.push("/main");
          } else {
            alert("오류");
          }
        });
    } else {
      alert("내용을 모두 입력해주세요");
    }
  };

  const TitleHandler = (e) => {
    setTitle(e.target.value);
    console.log(e.target.value.length);
  };

  const [total_UPpercent, set_total_UPpercent] = useState("");
  const [total_Downpercent, set_total_Downpercent] = useState("");
  const onCodeHandler = (event, newValue) => {
    console.log(newValue?.name);
    const codename = newValue?.name;
    setCodeInput(newValue);
    axios
      .post(SERVER_URI + "/finance/info", {
        finance_name: codename,
      })
      .then((response) => {
        if (response.data === "") {
          set_total_UPpercent(50);
          set_total_Downpercent(50);
        } else {
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
        }
      });
  };
  const Back = () => {
    history.goBack();
  };
  ////////////////////
  //modules는 꼭 useMemo를 사용해야한다. 그렇지 않으면addrange() the given range isn't in document 에러가 발생
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [
            { header: [1, 2, 3, false] },
            "bold",
            "italic",
            "underline",
            "strike",
            { list: "ordered" },
            { list: "bullet" },
            {
              color: [
                "#001F3F",
                "#FF0000",
                "#0074D9",
                "#2ECC40",
                "#FF851B",
                "#85144B",
                "#F012BE",
              ],
            },
          ],
          ["image", "video", "link"],
        ],
        handlers: {
          image: image_upload_click,
        },
      },
      ImageResize: {
        modules: ["Resize", "DisplaySize"],
        handleStyles: {
          backgroundColor: "black",
          border: "none",
          color: "white",
        },
      },
      VideoResize: {
        modules: ["Resize", "DisplaySize"],
        tagName: "iframe", // iframe | video
      },
    };
  }, []);
  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "image",
    "video",
    "link",
  ];
  ////////////////
  const [checked, setChecked] = useState(false);
  const handleChange = (event) => {
    console.log(event.target.checked);
    setChecked(event.target.checked);
  };
  return (
    <div>
      <div className="App">
        <h2>글 작성</h2>
        <div className="favorite_check_div">
          <Autocomplete
            onChange={onCodeHandler}
            options={Codedata}
            getOptionLabel={(option) => option.name + "ㅣ" + option.code}
            style={{ width: 250 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="종목코드를 선택하세요"
                margin="normal"
              />
            )}
          />
        </div>
        {CodeInput === undefined ? (
          ""
        ) : (
          <div style={{ display: "flex", height: "30px" }}>
            <div
              className="vote"
              style={{
                marginTop: "-9px",
                width: "250px",
                height: "34px",
              }}
            >
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
            <span className="favorite_check">
              관심종목등록
              <Checkbox
                color="primary"
                onChange={handleChange}
                style={{ color: "rgba(236, 106, 23)" }}
              />
            </span>
          </div>
        )}

        <Input
          className="title"
          type="text"
          placeholder="제목을 입력해주세요"
          onChange={TitleHandler}
        />
        <p className="warning">
          음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의
          책임을 질 수 있습니다.
        </p>
        <div>
          <ReactQuill
            style={{ height: "450px" }}
            ref={quillRef}
            theme="snow"
            placeholder="내용을 입력해주세요"
            value={ContentData}
            onChange={setContentData}
            modules={modules}
            formats={formats}
          />
        </div>
        <br></br>
        <input
          ref={fileRef}
          type="file"
          onChange={imageHandler}
          accept="image/jpeg , image/png"
          multiple="multiple"
          style={{ visibility: "hidden" }}
        />
      </div>
      <div className="edit_button_wrap">
        <Button
          style={{
            color: "rgba(236, 106, 23)",
          }}
          onClick={submitReview}
        >
          작성
        </Button>
        <Button onClick={Back} style={{ marginLeft: "1px" }}>
          취소
        </Button>
      </div>
      {loading && <Loading />}
      <br></br>
    </div>
  );
}

export default PostWrite;
