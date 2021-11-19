import { Button, Input } from "antd";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loading from "../../components/Loading";
import config from "../../config/index";
const { IMAGE_URI } = config;
const { SERVER_URI } = config;
const { FINCODE_URI } = config;
//import ImageResize from "quill-image-resize";
//import VideoResize from "quill-video-resize-module2";
//Quill.register("modules/ImageResize", ImageResize);
//Quill.register("modules/VideoResize", VideoResize);

function PostEdit() {
  const quillRef = useRef();
  const fileRef = useRef();
  const [loading, setloading] = useState(false);
  const image_upload_click = () => fileRef.current.click();

  const imageHandler = (event) => {
    //console.log("실행");
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
        ////console.log("성공 시, 백엔드가 보내주는 데이터", response.data.images);
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
        setloading(false);
        event.target.value = "";
      });
  };
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
        parchment: Quill.import("parchment"),
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
  // const formats = [
  //   "header",
  //   "bold",
  //   "italic",
  //   "underline",
  //   "strike",
  //   "list",
  //   "bullet",
  //   "color",
  //   "image",
  //   "video",
  //   "link",
  // ];
  ////////////수정용 종목코드 가져오기//////////////////////
  const [Codedata, setCodeData] = useState([]);
  useEffect(() => {
    axios.get(FINCODE_URI).then((response) => {
      ////console.log(response.data.datalist);
      const CodeList = response.data.datalist;
      setCodeData(CodeList);
    });
  }, []);

  //////////////////////////////////가져오기//////////////////////////////////////////////////////////////////

  const board_id = useParams();
  const history = useHistory();
  const [Origintitle, setOrigintitle] = useState("");
  const [Origincontent, setOrigincontent] = useState("");
  const [OriginCode, setOriginCode] = useState([]);

  useEffect(() => {
    axios.get(SERVER_URI + "/board/view/" + board_id.id).then((response) => {
      ////console.log("가져올때", response.data.list.post_content);
      setOrigintitle(response.data.list.post_title);
      setOriginCode(response.data.list.post_fin_list);
      setOrigincontent(response.data.list.post_content);
    });
  }, [board_id]);
  ////////////////////////////// 글수정////////////////////////////////////////////////////////////////////////////////

  const submitReview = () => {
    axios
      .post(
        SERVER_URI + "/board/update",
        {
          board_id: board_id.id,
          board_title: Origintitle,
          board_content: Origincontent,
          board_item: OriginCode,
        },
        {
          headers: { authorization: sessionStorage.getItem("user_Token") },
        }
      )
      .then(() => {
        alert("수정 완료!");
        history.push("/posts/" + board_id.id);
      });
  };

  const onTitleHandler = (event) => {
    setOrigintitle(event.currentTarget.value);
  };

  const onCodeHandler = (event, newValue) => {
    setOriginCode(newValue);
  };

  const Back = () => {
    history.goBack();
  };
  return (
    <div>
      <div className="App">
        <h2>글 수정</h2>
        <Autocomplete
          onChange={onCodeHandler}
          options={Codedata}
          value={OriginCode}
          getOptionLabel={(option) => option.name + "ㅣ" + option.code}
          getOptionSelected={(option, value) => option.name === value.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="종목코드" margin="normal" />
          )}
        />
        <Input
          className="title"
          type="text"
          value={Origintitle}
          placeholder="제목"
          onChange={onTitleHandler}
          name="board_title"
        />
        <div>
          <ReactQuill
            style={{ height: "450px" }}
            ref={quillRef}
            theme="snow"
            placeholder="글을 작성해주세요"
            value={Origincontent}
            onChange={setOrigincontent}
            modules={modules}
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
          수정
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

export default PostEdit;
