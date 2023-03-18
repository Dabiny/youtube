import express from "express";
import {
    getEditUser,
    postEditUser,
    deleteUser,
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChangePassword,
} from "../controllers/userControllers";
import {
    multerMiddlewareforAvatar,
    protectorMiddleware,
    publicOnlyMiddleware,
} from "../middlewares";
const userRouter = express.Router();

// url을 구분해서 보호하기
// logout은 로그인된 사람들만 로그아웃페이지로 갈 수 있어야한다.
userRouter.get("/logout", protectorMiddleware, logout);
// 마찬가지로 프로필도 로그인된 사람들만 페이지로 갈 수 있어야한다. all()함수 쓰면 개별적으로 미들웨어추가안해도댐.
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEditUser)
    // multer미들웨어 설정 single -> 하나의파일
    .post(multerMiddlewareforAvatar.single("avatar"), postEditUser);

userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);

export default userRouter;
