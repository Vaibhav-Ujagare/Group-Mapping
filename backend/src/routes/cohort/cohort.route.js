import { Router } from "express";
import { createCohort } from "./cohort.controller.js";
import { isLoggedIn, isAdmin } from "../../middleware/auth.middleware.js";

const cohortRoute = Router();

cohortRoute.post("/create", isLoggedIn, isAdmin, createCohort);

export default cohortRoute;
