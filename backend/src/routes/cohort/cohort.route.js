import { Router } from "express";
import { createCohort } from "./cohort.controller.js";
import { isSuperAdmin } from "../../middleware/auth.middleware.js";

const cohortRoute = Router();

cohortRoute.post("/create", isSuperAdmin, createCohort);

export default cohortRoute;
