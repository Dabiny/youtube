import express from "express";
import {editUser, deleteUser, logout, see} from "../controllers/userControllers";
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get(":id", see);

export default userRouter;