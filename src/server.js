// node_modules에서 찾아서 가져온다. 
// import 가 너무 길어지니 init파일에 따로 분리하고 저장하기


import express from "express";
import morgan from "morgan";
import session from "express-session";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

// application 생성
const app = express();
const loggerMiddleware = morgan("dev");


// console.log(process.cwd());

// 미들웨어 위치 중요하다. 위에서 아래로 
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug"); // pug 설정
app.use(loggerMiddleware);

app.use(express.urlencoded({ extended: true }));
// 사이트로 들어오는 모두를 기억하게 될것임. 로그인을 하지 않아도
// 백엔드에서 정체불명 string의 cookie를 브라우저에게 주고있다. 
// 정체불명의 string은 우리의 id이다.
app.use(session({
    secret: "Hello!", // 비밀편지
    resave: true,
    saveUninitialized: true,
}))
app.use(localsMiddleware);
// app.get("/add-one", (req, res) => {
//     req.session.potato += 1;
//     return res.send(`${req.session.id}\n${req.session.potato}`);
// })

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