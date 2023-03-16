import express from "express";
import { search, watchVideos } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userControllers";

const globalRouter = express.Router();

globalRouter.get("/", watchVideos);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/search", search);

export default globalRouter;