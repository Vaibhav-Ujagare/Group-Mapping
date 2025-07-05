import bcrypt from "bcryptjs";
import { db } from "../../db/dbConnection.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { UserRole } from "../../generated/prisma/index.js";
import csv from "csv-parser";
import fs from "fs";

import {
    sendMail,
    emailVerificationMailGenContent,
    resendEmailVerificationMailGenContent,
    resetPasswordVerificationMailGenContent,
} from "../../utils/mail.js";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await db.super_admin.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
            },
        });

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
        );

        await db.super_admin.update({
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

export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.super_admin.findUnique({
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
            .json(new ApiResponse(200, user, "Logged in as admin"));
    } catch (error) {
        throw new ApiError(400, error || "Error while loggin");
    }
});

export const uploadCSV = asyncHandler(async (req, res) => {
    const csvFile = req.files?.cohort_data[0]?.path;
    const results = [];
    if (!csvFile) {
        throw new ApiError(400, "CSV file is required");
    }

    fs.createReadStream(csvFile)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                for (const row of results) {
                    let str =
                        "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";
                    let pass = "";

                    for (let i = 1; i <= 10; i++) {
                        let char = Math.floor(Math.random() * str.length + 1);
                        pass += str.charAt(char);
                    }
                    const hashedPassword = await bcrypt.hash(pass, 10);

                    await db.student_details.create({
                        data: {
                            email: row.Email,
                            password: hashedPassword,
                            cohort_name: row.Cohort_Name,
                            role: UserRole.MEMBER,
                        },
                    });

                    console.log(row.Email);
                    console.log(pass);

                    // await sendMail({
                    //     email: row.Email,
                    //     subject: "Verify your email",
                    //     mailGenContent: emailVerificationMailGenContent(
                    //         row.Email,
                    //         `${process.env.BASE_URL}/api/v1/user/verify/${emailVerificationToken}`,
                    //         row.Email,
                    //         pass,
                    //     ),
                    // });
                }
            } catch (error) {
                throw new ApiError(500, error || "Failed to insert data");
            } finally {
                fs.unlinkSync(csvFile);
            }
        });

    return res
        .status(201)
        .json(new ApiResponse(200, csvFile, "File Upload Successfully"));
});

export const showCSVData = asyncHandler(async (req, res) => {
    const allStudents = await db.student_details.findMany({
        select: {
            id: true,
            email: true,
            cohort_name: true,
            role: true,
            canCreateGroup: true,
            isGroupJoined: true,
        },
    });
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                allStudents,
                "All Student details Fetched Successfully",
            ),
        );
});

export const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user,
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error: "Error checking user",
        });
    }
};

export const logoutUser = asyncHandler(async (req, res) => {
    console.log("controller reached");
    await db.super_admin.update({
        where: { id: req.user.id }, // assuming req.user.id is the correct field
        data: {
            refreshToken: null,
        },
    });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/", // ensure it applies site-wide
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User Logged Out!"));
});
