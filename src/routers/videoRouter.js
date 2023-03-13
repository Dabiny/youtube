import express from "express";
import { watchVideos, see, editVideos, deleteVideo, upload } from "../controllers/videoController";

const videoRouter = express.Router();

// /videos/watch
// 순서조심 topdown방식이라 param이 먹히면 안되는 것들은 위로 올리자
videoRouter.get("/watch", watchVideos);
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", editVideos);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);


export default videoRouter;