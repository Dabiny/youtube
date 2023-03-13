import express from "express";
import { watchVideos, see, getEdit, deleteVideo, postEdit, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();

// /videos/watch
// 순서조심 topdown방식이라 param이 먹히면 안되는 것들은 위로 올리자
videoRouter.get("/watch", watchVideos);

videoRouter.route("/upload").get(getUpload).post(postUpload);

videoRouter.get("/:id(\\d+)", see);

// url은 똑같지만, funtion은 다름
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// 더짧게쓰는법
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

videoRouter.get("/:id(\\d+)/delete", deleteVideo);


export default videoRouter;