import { Router } from "express";
import {
    adminLogin,
    check,
    showCSVData,
    uploadCSV,
} from "./admin.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { isSuperAdmin } from "../../middleware/auth.middleware.js";

const adminRoute = Router();

adminRoute.post("/login", adminLogin);

adminRoute.post(
    "/upload",
    isSuperAdmin,
    upload.fields([
        {
            name: "cohort_data",
            maxCount: 1,
        },
    ]),
    uploadCSV,
);

adminRoute.get("/student-data", showCSVData);

adminRoute.get("/check", check);

export default adminRoute;
