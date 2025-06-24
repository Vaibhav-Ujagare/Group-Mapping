import { Router } from "express";
import { adminLogin, showCSVData, uploadCSV } from "./admin.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { isLoggedIn, isAdmin } from "../../middleware/auth.middleware.js";

const adminRoute = Router();

adminRoute.post("/login", adminLogin);

adminRoute.post(
    "/upload",
    isLoggedIn,
    isAdmin,
    upload.fields([
        {
            name: "cohort_data",
            maxCount: 1,
        },
    ]),
    uploadCSV,
);

adminRoute.get("/student-data", showCSVData);

export default adminRoute;
