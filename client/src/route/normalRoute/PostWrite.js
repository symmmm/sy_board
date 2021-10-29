import React from "react";
import { Button, Divider, Input } from "antd";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch } from "react-redux";
import { DeleteSearch } from "../../redux/reducers/PageReducer";
import { DeletNoWid } from "../../redux/reducers/NowpageReducer";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loading from "../../components/Loading";
import ImageResize from "quill-image-resize";
import VideoResize from "quill-video-resize-module2";
import config from "../../config/index";
const { IMAGE_URI } = config;
const { SERVER_URI } = config;
const { FINCODE_URI } = config;
// console.log(FINCODE_URI);
// console.log(SERVER_URI);
// console.log(IMAGE_URI);
Quill.register("modules/ImageResize", ImageResize);
Quill.register("modules/VideoResize", VideoResize);

function PostWrite() {
  const quillRef = useRef();
  const fileRef = useRef();
  const [loading, setloading] = useState(false);
  const image_upload_click = () => fileRef.current.click();

  const imageHandler = (event) => {
    console.log("실행");
    setloading(true);
    const file = event.target.files; // 데이터 만들어준다.
    const formData = new FormData();
    Object.values(file).forEach((file) => formData.append("imgs", file));
    //formData.append("imgs", file); // formData는 키-밸류 구조
    formData.append("path", "community/board"); //path도 formdata에 넣어준다
    // 백엔드 multer라우터에 이미지를 보낸다.
    axios
      .post(IMAGE_URI, formData, {
        headers: {
          "Content-Type": `multipart/form-data; `,
        },
      })
      .then((response) => {
        //console.log("성공 시, 백엔드가 보내주는 데이터", response.data.images);
        const IMG_URL = response.data.images;
        //console.log("배열이미지", IMG_URL.length);
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
        const range = editor.getSelection();
        for (var i = 0; i < IMG_URL.length; i++) {
          if (IMG_URL[i]) {
            editor.insertEmbed(range, "image", IMG_URL[i].imgurl);
            //console.log("이미지삽입실행", IMG_URL[i].imgurl);
          }
        }
        setloading(false);
        event.target.value = "";
      });
  };
  ////////////////////////////////////////////////////////////////////
  const [Codedata, setCodeData] = useState([]);
  const dispatch = useDispatch();
  ////////////////////////////////////////////////종목코드 받아오기////////////////////////////////////
  useEffect(() => {
    axios.get(FINCODE_URI).then((response) => {
      ////console.log(response.data.datalist);
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
    if (CodeInput && ContentData && Title) {
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
            alert("글 작성 완료");
            dispatch(DeletNoWid());
            dispatch(DeleteSearch());
            history.push("/main");
          }
        });
    } else {
      alert("내용을 모두 입력해주세요");
    }
  };

  const TitleHandler = (e) => {
    setTitle(e.target.value);
  };

  const onCodeHandler = (event, newValue) => {
    setCodeInput(newValue);
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
        modules: ["Resize", "DisplaySize", "Toolbar"],
        handleStyles: {
          backgroundColor: "black",
          border: "none",
          color: "white",
        },
      },
      VideoResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
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
  return (
    <div>
      <div className="App">
        <h2>글 작성</h2>
        <Autocomplete
          onChange={onCodeHandler}
          options={Codedata}
          getOptionLabel={(option) => option.name + "ㅣ" + option.code}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="종목코드를 선택하세요"
              margin="normal"
            />
          )}
        />
        <Input
          className="title"
          type="text"
          placeholder="제목"
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
            placeholder="글을 작성해주세요"
            value={ContentData}
            onChange={setContentData}
            modules={modules}
            formats={formats}
          />
        </div>
        <br></br>
        <br></br>
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
      <div className="detail_button_wrap">
        <Button type="primary" onClick={submitReview}>
          등록
        </Button>
        <Button type="primary" onClick={Back} style={{ marginLeft: "1px" }}>
          취소
        </Button>
      </div>
      {loading && <Loading />}
      <Divider />
    </div>
  );
}

export default PostWrite;