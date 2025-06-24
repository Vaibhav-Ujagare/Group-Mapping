import bcrypt from "bcryptjs";
import { db } from "../db/dbConnection.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await db.super_admin.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                username: true,
            },
        });

        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
        );

        console.log(user.username);

        await db.super_admin.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token",
        );
    }
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
    } catch (error) {}
    const user = await db.super_admin.findUnique({
        where: {
            username,
        },
    });

    if (!user) {
        return res.status(400).json({ error: "User Not Found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        return res
            .status(400)
            .json({ error: "User name or Password incorrect" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user.id,
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
        message: "You Logged in as super admin",
    });
};
