import React, { useState, useEffect } from "react";

const Topbanner = () => {
  const TOPBANNER = localStorage.getItem("TOPBANNER");
  const [showbanner, set_showbanner] = useState(false);
  useEffect(() => {
    if (TOPBANNER) {
      set_showbanner(false);
    } else if (!TOPBANNER) {
      set_showbanner(true);
    }
  }, [TOPBANNER]);

  const banner_close = () => {
    set_showbanner(false);
    let expires = new Date();
    expires = expires.setHours(expires.getHours() + 24);
    localStorage.setItem("TOPBANNER", expires);
  };
  return showbanner ? (
    <div className="Topbanner">
      <div
        style={{
          width: "1300px",
          backgroundColor: "black",
          height: "120px",
          display: "flex",
          flexDirection: "row",
          margin: "0 auto",
          justifyContent: "space-around",
        }}
      >
        <div className="topbanner_image">
          <a
            href="https://www.hitalktv.com/maingo.do"
            target="_blank"
            rel="noreferrer noopenner"
          ></a>
          <a href="#/" onClick={banner_close} className="close_button">
            {" "}
          </a>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Topbanner;
