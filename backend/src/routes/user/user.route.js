import { Router } from "express";
import { isLoggedIn } from "../../middleware/auth.middleware.js";
import {
    getAllJoiningRequests,
    handleRequest,
    login,
    selectCohort,
    sendJoiningRequest,
} from "./user.controller.js";

const userRoute = Router();

userRoute.post("/login", login);

userRoute.post("/select-cohort", isLoggedIn, selectCohort);

userRoute.post("/request/:groupId", isLoggedIn, sendJoiningRequest);

userRoute.get("/getAllRequests", isLoggedIn, getAllJoiningRequests);

userRoute.post("/handle-request", isLoggedIn, handleRequest);

export default userRoute;
