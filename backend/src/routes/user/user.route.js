import { Router } from "express";
import { isLoggedIn } from "../../middleware/auth.middleware.js";
import {
    handleRequest,
    login,
    selectCohort,
    sendJoinigRequest,
} from "./user.controller.js";

const userRoute = Router();

userRoute.post("/login", login);

userRoute.get("/select-cohort", isLoggedIn, selectCohort);

userRoute.post("/request/:groupId", isLoggedIn, sendJoinigRequest);

userRoute.get("/handle-request", isLoggedIn, handleRequest);

export default userRoute;
