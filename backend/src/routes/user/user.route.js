import { Router } from "express";
import { isLoggedIn } from "../../middleware/auth.middleware.js";
import {
    getAllJoiningRequests,
    handleRequest,
    login,
    selectCohort,
    sendJoiningRequest,
    getUserHistory,
    getUserProfile,
    getAllUsers,
    check,
    logoutUser,
} from "./user.controller.js";

const userRoute = Router();

userRoute.post("/login", login);

userRoute.post("/select-cohort", isLoggedIn, selectCohort);

userRoute.post("/request/:groupId", isLoggedIn, sendJoiningRequest);

userRoute.get("/getAllRequests", isLoggedIn, getAllJoiningRequests);

userRoute.get("/profile", isLoggedIn, getUserProfile);

userRoute.get("/:userId/history", isLoggedIn, getUserHistory);

userRoute.get("/all-users", getAllUsers);

userRoute.post("/handle-request", isLoggedIn, handleRequest);

userRoute.post("/logout", isLoggedIn, logoutUser);

userRoute.get("/check", isLoggedIn, check);

export default userRoute;
