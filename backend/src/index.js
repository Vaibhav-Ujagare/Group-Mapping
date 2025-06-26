import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(
    cors({
        origin: [process.env.BASE_URL],
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        exposedHeaders: ["Set-Cookie", "*"],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import adminRoute from "./routes/admin/admin.route.js";
import cohortRoute from "./routes/cohort/cohort.route.js";
import userRoute from "./routes/user/user.route.js";
import groupRoute from "./routes/group/group.route.js";

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/group", groupRoute);
app.use("/api/v1/cohort", cohortRoute);
