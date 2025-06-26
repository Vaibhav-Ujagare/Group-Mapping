import { db } from "../../db/dbConnection.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    sendMail,
    emailVerificationMailGenContent,
    resendEmailVerificationMailGenContent,
    resetPasswordVerificationMailGenContent,
} from "../../utils/mail.js";
import bcrypt from "bcryptjs";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await db.student_details.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        });

        const accessToken = jwt.sign(
            {
                id: user.id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
        );

        await db.student_details.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken, accessToken: accessToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token",
        );
    }
};

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.student_details.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ApiError(400, "User Not Found");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            throw new ApiError(401, "Username or Password is incorrect");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user.id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res
            .status(201)
            .json(new ApiResponse(200, user, "Login Successfully"));
    } catch (error) {
        throw new ApiError(400, error || "Error while loggin");
    }
});
