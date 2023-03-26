// dotenv 내 앱에서 맨 위에 넣기 -> 맨위: 서버시작하는 url -> init.js
// require("dotenv").config();
import "regenerator-runtime";
import "dotenv/config";

import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

// listen의 callback함수는 서버가시작될때 작동하는 함수다.
const handleListening = () => console.log("Server listening on port 4000");
app.listen(POR, handleListening);
