import { Router } from "express";
import { adminLogin } from "./admin.controller.js";

const adminRoute = Router();

adminRoute.post("/login", adminLogin);

export default adminRoute;
