// api: 백엔드가 템플릿을 렌더링을하지않을 때 fe와 be가 서버를통해 통신하는 방법
import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();
// 유저가 영상시청 -> 백엔드에 요청보낼거임. -> URL을 바꾸진않을거임
// 요청을보내더라도 URL을 바꾸지않고 템플릿을 렌더링하지 않겠다는 얘기
// 백엔드 조회수 +1 할거임.
// fe에서 js로 호출하는 URL
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;