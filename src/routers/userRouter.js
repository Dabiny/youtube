import express from "express";
import {
    editUser,
    deleteUser,
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
} from "../controllers/userControllers";
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;
