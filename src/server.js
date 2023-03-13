// node_modules에서 찾아서 가져온다. 
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// application 생성
const app = express();
const loggerMiddleware = morgan("dev");
app.use(loggerMiddleware);

console.log(process.cwd());

// 라우터 설정 (코드분할하기)
// const globalRouter = express.Router();
// const handleHome = (req, res) => res.send("HOME");
// globalRouter.get("/", handleHome);

// const userRouter = express.Router();
// const handleEditUser = (req, res) => res.send("Edit User");
// userRouter.get("/edit", handleEditUser);

// const videoRouter = express.Router();
// const handleWatchVideo = (req, res) => res.send("Watch video");
// videoRouter.get("/watch", handleWatchVideo);

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug"); // pug 설정
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


// what is server ?
// 서버는 항상 켜져있는 컴퓨터. 인터넷에 연결되어있는 컴퓨터 
// request을 listen하고 있음. 
// www.ex.com/login -> /login이 요청 

// 누군가 login을 요청했네 무언가해야돼 -> listen

// application 설정
// call back 첫번째는 request, 두번째는 response
// exoress로부터 받은 요청, 응답인자이다.
// 응답해주는건 필수다. 응답해주지않으면 브라우저가 계속 기다린다.
// 텍스트 html, 파일, status code.. 등 다양한걸 보내줄수(응답) 있다.

// const gossipMiddleware = (req, res, next) => { // middleware
//     console.log("I'm in the middle");
//     console.log(`${req.method}: ${req.url}`);
//     next();
// };
// const privateMiddleware = (req, res, next) => {
//     const url = req.url;
//     if (url === "/protected") {
//         return res.send("<h1>Not allowed</h1>");
//     } 
//     console.log("Allowed, you may continue");
//     next();
// };

// const handleHome = (req, res, next) => { // finalware
//     return res.send("I love middleware");
// };
// const handleProtected = (req, res, next) => {
//     return res.send("Welcome to the private rounge");
// };

// 순서조심
// app.use(gossipMiddleware);
// app.use(privateMiddleware);

// morgan 사용
// app.use(loggerMiddleware); // morgan은 GET / 200 2.798 ms - 17 GET, path, status 모든정보를 가지고있음


// app.get("/", /*gossipMiddleware*/ handleHome);
// app.get("/protected", handleProtected);

// app.get("/", (req, res, next) => {
//     //console.log("Somebody is trying to go home");
//     //console.log(res.end);
//     //return res.end();
//     //return res.send("I still love u");
//     //next();
    
// });

app.get("/login", (req, res) => {
    return res.send({
        message: "login here"
    });
})
// listen의 callback함수는 서버가시작될때 작동하는 함수다. 
const handleListening = () => console.log("Server listening on port 4000");
app.listen(4000, handleListening);

// 보동 localhoset로 열린다. 