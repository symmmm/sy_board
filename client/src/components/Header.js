import React from "react";

const Header = () => {
  return (
    <div
      style={{
        backgroundColor: "orange",
        height: "150px",
        marginBottom: "30px",
        paddingTop: "55px",
      }}
    >
      <div className="header-text">
        <span style={{ fontSize: "35px", fontWeight: "bold" }}>
          종목토론게시판
        </span>
      </div>
    </div>
  );
};

export default Header;
