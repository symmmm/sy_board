import React, { useState } from "react";
import { Modal, Button, Menu, Dropdown, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../config/index";
const { SERVER_URI } = config;
const { TextArea } = Input;

const Report = (props) => {
  const [getMenu, setMenu] = useState("신고사항을 선택해주세요");
  const [content, setcontent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    axios
      .post(SERVER_URI + "/report/report", {
        report_form_data: { selected_value: getMenu, content: content },
        report_user: props.report_user, //신고자
        board_id: props.board_id,
        bad_user: props.bad_user,
      })
      .then((response) => {
        console.log(response);
      });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function handleMenuClick(e) {
    setMenu(e.key);
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="불법홍보">불법홍보</Menu.Item>
      <Menu.Item key="욕설">욕설</Menu.Item>
      <Menu.Item key="음란물">음란물</Menu.Item>
      <Menu.Item key="선동">선동</Menu.Item>
    </Menu>
  );

  function texthandler(e) {
    console.log(e.currentTarget.value);
    setcontent(e.currentTarget.value);
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        신고
      </Button>
      <Modal
        title="게시글 신고"
        centered
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="신고하기"
        cancelText="취소"
      >
        <p>제목 : {props.report_title}</p>
        <p>작성자 : {props.bad_user}</p>
        <p>
          신고사항 :{" "}
          <Dropdown overlay={menu} trigger="click">
            <Button>
              {getMenu} <DownOutlined />
            </Button>
          </Dropdown>{" "}
        </p>
        <TextArea
          onChange={texthandler}
          placeholder="신고사유를 입력해주세요"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        {/* <p>게시글id : {props.board_id}</p>
        <p>신고자 : {props.report_user}</p> */}
      </Modal>
    </>
  );
};

export default Report;
