import express from "express";
import { watchVideos, see, getEdit, deleteVideo, postEdit, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();

// /videos/watch
// 순서조심 topdown방식이라 param이 먹히면 안되는 것들은 위로 올리자
videoRouter.get("/watch", watchVideos);

videoRouter.route("/upload").get(getUpload).post(postUpload);

// 임의의 id주소로 보여져야함. 지금은 숫자로만 허용되도록 되어있음. 
// mongodb의 아이디를 정규표현식으로 제한해보자. 
// mongodb의 id부여는 24byte의 hex string으로 구성되어있다.
// 0 ~ 9, a - f 로 24개의 구성되어있는 string. [0-9a-f]{24}
videoRouter.get("/:id([0-9a-f]{24})", see);

// url은 똑같지만, funtion은 다름
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// 더짧게쓰는법
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);

videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);


export default videoRouter;