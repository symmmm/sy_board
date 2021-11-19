import React, { useState } from "react";
import { Modal, Button, Menu, Dropdown, Input } from "antd";
import { DownOutlined, AlertOutlined } from "@ant-design/icons";
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
        comment_id: props.comment_id,
        bad_user: props.bad_user,
      })
      .then((response) => {
        //console.log(response);
        alert(
          "신고가 완료되었습니다. 신고된 내용은 확인후 신속하게 처리하겠습니다."
        );
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
      <Menu.Item key="욕설">욕설</Menu.Item>
      <Menu.Item key="불법홍보">허위루머</Menu.Item>
      <Menu.Item key="음란물">타종목추천</Menu.Item>
      <Menu.Item key="도배">도배</Menu.Item>
      <Menu.Item key="명예훼손">명예훼손</Menu.Item>
      <Menu.Item key="주제무관">주제무관</Menu.Item>
    </Menu>
  );

  function texthandler(e) {
    setcontent(e.currentTarget.value);
  }
  return (
    <>
      <AlertOutlined onClick={showModal} className="report_btn" />
      <Modal
        className="report_modal"
        title="댓글 신고하기"
        centered
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="신고하기"
        cancelButtonProps={{ style: { display: "none" } }}
        footer={null}
      >
        <p className="report_content">댓글내용 : {props.comment_content}</p>
        <p>작성자 : {props.bad_user_nick}</p>
        <p>
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
        <div style={{ marginTop: "15px", display: "flex" }}>
          신고된 내용은 확인후 처리하겠습니다. 소중한 신고 감사합니다.
          <span
            onClick={handleOk}
            style={{
              color: "red",
              display: "flex",
              alignItems: "center",
              marginLeft: "45px",
              cursor: "pointer",
            }}
          >
            <AlertOutlined />
            신고하기
          </span>
        </div>
      </Modal>
    </>
  );
};

export default Report;
