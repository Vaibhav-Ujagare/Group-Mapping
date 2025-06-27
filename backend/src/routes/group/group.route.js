import { Router } from "express";
import {
    createGroup,
    getAllGroupMembers,
    getAllGroups,
} from "./group.controller.js";
import { isLoggedIn } from "../../middleware/auth.middleware.js";

const groupRoute = Router();

groupRoute.post("/create", isLoggedIn, createGroup);

groupRoute.get("/all-groups", isLoggedIn, getAllGroups);

groupRoute.get("/:groupId/group-members", isLoggedIn, getAllGroupMembers);

export default groupRoute;
