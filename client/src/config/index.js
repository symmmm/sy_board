import dotenv from "dotenv";

dotenv.config();

const config = {
  LOGIN_URI: process.env.REACT_APP_LOGIN_URI,
  IMAGE_URI: process.env.REACT_APP_IMAGE_URI,
  SERVER_URI: process.env.REACT_APP_SERVER_URI,
  FINCODE_URI: process.env.REACT_APP_FINCODE_URI,
};

export default config;
