import express from "express";
import { search, watchVideos } from "../controllers/videoController";
import {
    getJoin,
    postJoin,
    getLogin,
    postLogin,
} from "../controllers/userControllers";
import { publicOnlyMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", watchVideos);
globalRouter
    .route("/join")
    .all(publicOnlyMiddleware)
    .get(getJoin)
    .post(postJoin);
globalRouter
    .route("/login")
    .all(publicOnlyMiddleware)
    .get(getLogin)
    .post(postLogin);
globalRouter.get("/search", search);

export default globalRouter;
