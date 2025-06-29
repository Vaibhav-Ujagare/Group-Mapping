import { Router } from "express";
import {
    createGroup,
    deleteGroup,
    getAllGroupMembers,
    getAllGroups,
    leaveGroup,
    removeGroupMember,
} from "./group.controller.js";
import { isLoggedIn } from "../../middleware/auth.middleware.js";

const groupRoute = Router();

groupRoute.post("/create", isLoggedIn, createGroup);

groupRoute.get("/all-groups", isLoggedIn, getAllGroups);

groupRoute.get("/:groupId/group-members", isLoggedIn, getAllGroupMembers);

groupRoute.post("/remove-member", isLoggedIn, removeGroupMember);

groupRoute.post("/leave", isLoggedIn, leaveGroup);

groupRoute.post("/delete-group", isLoggedIn, deleteGroup);

export default groupRoute;
