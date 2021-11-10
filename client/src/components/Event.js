import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const data = [
  {
    event: " [EVENT] aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    link: "www.naver.com",
  },
  {
    event: " [EVENT] bbbbbbbbbbbbbbbbbbb",
    link: "www.naver.com",
  },
  {
    event: " [EVENT] bbbbbbbbbbbbbbbbbbb",
    link: "www.naver.com",
  },
  {
    event: " [EVENT] ccccccccccccccccccccccccccc",
    link: "www.naver.com",
  },
  {
    event: " [EVENT] dddddddddddddddddddddddddddddddddddddddddddd",
    link: "www.naver.com",
  },
];

const Event = () => {
  const [onScreen, setonScreen] = useState(true);
  const more = () => {
    setonScreen(!onScreen);
  };
  return (
    <div style={{ display: "flex" }}>
      <div className="event_box">
        <div className="news_top">
          News & Events
          {onScreen ? (
            <DownOutlined onClick={more} style={{ marginLeft: "2px" }} />
          ) : (
            <UpOutlined onClick={more} style={{ marginLeft: "2px" }} />
          )}
        </div>

        {onScreen ? (
          <div className="animated-text">
            {data.map((aaa, index) => (
              <div className="line" key={index}>
                <a href={aaa.link} target="_blank" rel="noreferrer noopenner">
                  {aaa.event}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="news">
            {data.map((aaa, index) => (
              <div className="line2" key={index}>
                <a href={aaa.link} target="_blank" rel="noreferrer noopenner">
                  {aaa.event}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
