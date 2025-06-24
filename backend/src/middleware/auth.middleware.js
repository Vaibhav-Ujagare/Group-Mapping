import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { db } from "../db/dbConnection.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized request - Missing Access Token",
            );
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await db.super_admin.findUnique({
            where: {
                id: decodedToken.id,
            },
            select: { id: true },
        });

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await db.super_admin.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ApiError(401, "Access Deined - Admin Only");
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Error Checking Admin Role");
    }
});
