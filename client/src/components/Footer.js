import React from "react";
//import logofunitwhite from "../img/logo-funit-white.png";
import suwon_logo from "../img/logo.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-img">
        <a
          href="http://www.suwon.ac.kr/"
          target="_blank"
          rel="noreferrer noopenner"
        >
          {" "}
          <img
            alt="logo-funit-white"
            src={suwon_logo}
            style={{ width: "100px", height: "55px" }}
          ></img>
        </a>
      </div>
      <div className="footer-info">
        <p style={{ marginBottom: "2px" }}>
          ㈜승윤 사업자등록번호 : 111-22-33333 서울특별시 금천구 독산로 11-1
          xx빌딩 7층 대표 : 조승윤
        </p>
        <p style={{ marginBottom: "2px" }}>
          고객센터 : 010-5318-5341 이메일 : csymm@suwon.ac.kr 통신판매업신고 :
          2020-서울xx-1111 호
        </p>
        <p style={{ marginBottom: "2px" }}>
          본 사이트에서 제공하는 모든 정보는 투자판단의 참고자료이며, 서비스
          이용에 따른 최종 책임은 이용자에게 있습니다.
        </p>
        <p style={{ marginBottom: "2px" }}>
          Copyrightⓒ xxxxx All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
