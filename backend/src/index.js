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

import adminRoute from "./routes/admin.route.js";

app.use("/api/v1/admin", adminRoute);
