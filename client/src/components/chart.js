import React from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import config from "../config/index";
const { SERVER_URI } = config;

const Chart = () => {
  const [tdata, settdata] = useState([]);
  const fincode_redux_data = useSelector(
    (state) => state.PageSearchReducer.fincode
  );
  useEffect(() => {
    console.log("차트실행");
    axios
      .post(SERVER_URI + "/board/chart", {
        fin_name: fincode_redux_data,
      })
      .then((response) => {
        //console.log(response.data.chart_data);
        settdata(response.data.chart_data);
      });
    return () => {
      //console.log("클린업");
      settdata([]);
    };
  }, [fincode_redux_data]);

  /////////////

  return (
    <div>
      <span>{fincode_redux_data}의 최근 관심률</span>
      <LineChart
        width={255}
        height={120}
        data={tdata}
        margin={{
          top: 5,
          right: 5,
          left: -30,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickFormatter={(timeStr) => dayjs(timeStr).format("MM/DD")}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          labelFormatter={(value) => `날짜: ${value}`}
          formatter={(value) => [value + "%", "관심도"]}
        />
        <Line type="monotone" dataKey="data" stroke="red" strokeWidth={2} />
      </LineChart>
    </div>
  );
};

export default Chart;
