const { default: axios } = require("axios");
const Board = require("../data/board_Schema");
const moment = require("moment");
const { useState } = require("react");
const jwt = require("jsonwebtoken");
const { Base64 } = require("js-base64");
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;

module.exports = (app, secret) => {
  //로그인
  app.post("/login", (req, res) => {
    console.log("init Login");
    const get_user_name = req.body.userName;
    const make_token = jwt.sign({ userName: get_user_name }, secret);
    res.send(make_token);
    console.log("Login", make_token);
  });

  //로그아웃
  app.get("/logout", (req, res) => {
    res.json({ logout_result_code: 1 });

    console.log("logout");
  });

  //유저체크
  app.get("/user_check", async (req, res) => {
    console.log(token_check);

    if (token_check) {
      const header = req.header("authorization");
      const array = header.split(".");
      const userName = JSON.parse(Base64.decode(array[1])).userName;

      await res.json({ user_result: 1, userName: userName });
    } else {
      res.json({ user_result: 0 });
    }
  });
};
