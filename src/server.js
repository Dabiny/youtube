// node_modules에서 찾아서 가져온다. 
// import 가 너무 길어지니 init파일에 따로 분리하고 저장하기


import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// application 생성
const app = express();
const loggerMiddleware = morgan("dev");


// console.log(process.cwd());

// 미들웨어 위치 중요하다. 위에서 아래로 
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug"); // pug 설정
app.use(loggerMiddleware);

app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);



// listen함수 init에 넣기
app.get("/login", (req, res) => {
    return res.send({
        message: "login here"
    });
})

// 보동 localhoset로 열린다. 

export default app;