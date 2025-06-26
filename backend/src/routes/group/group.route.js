import { Router } from "express";
import { createGroup } from "./group.controller.js";
import { isLoggedIn } from "../../middleware/auth.middleware.js";

const groupRoute = Router();

groupRoute.post("/create", isLoggedIn, createGroup);

export default groupRoute;
