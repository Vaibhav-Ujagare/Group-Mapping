import { db } from "../../db/dbConnection.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { RequestStatus } from "../../generated/prisma/index.js";
import { AuditAction } from "../../generated/prisma/index.js";

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

export const selectCohort = asyncHandler(async (req, res) => {
    const { cohort_name } = req.body;

    if (!cohort_name) {
        throw new ApiError(400, "Please select the cohort");
    }

    const cohort = await db.cohort_details.findFirst({
        where: {
            cohort_name: cohort_name,
        },
        select: {
            id: true,
        },
    });

    if (!cohort) {
        throw new ApiError(400, "Cohort Not Found");
    }

    if (cohort_name === "Web_Dev") {
        await db.student_cohort_mapping_details.create({
            data: {
                studentId: req.user.id,
                cohortId: cohort.id,
            },
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Cohort Select Successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = db.student_details.findMany({});

    return res
        .status(201)
        .json(new ApiResponse(200, { users }, `All User Fetched Successfully`));
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = db.student_details.findMany({
        where: {
            id: userId,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(200, { user }, `User Details Fetched Successfully`),
        );
});

export const sendJoiningRequest = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    const user = await db.student_details.findUnique({
        where: {
            id: userId,
        },
    });

    if (user.role === "LEADER" || user.isGroupJoined) {
        throw new ApiError(400, "You are group leader or part of other group");
    }

    const existingRequest = await db.group_joining_request_details.findFirst({
        where: {
            studentId: userId,
            groupId: groupId,
        },
    });

    if (existingRequest) {
        throw new ApiError(400, "Request already send");
    }

    const newRequest = await db.group_joining_request_details.create({
        data: {
            studentId: userId,
            groupId: groupId,
            status: RequestStatus.REQUESTED,
            request_note_by_student: note,
            requested_on: new Date(Date.now()),
        },
    });

    await db.student_details.update({
        where: {
            id: userId,
        },
        data: {
            canCreateGroup: false,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(200, { newRequest }, "Request sent Successfully"),
        );
});

export const getAllJoiningRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const group = await db.student_group_mapping_details.findFirst({
        where: {
            studentId: userId,
        },
        select: {
            groupId: true,
        },
    });
    if (!group) {
        throw new ApiError(400, "You have not create any group");
    }

    const groupRequests = await db.group_joining_request_details.findMany({
        where: {
            groupId: group.groupId,
            status: "REQUESTED",
        },
    });

    if (groupRequests.length === 0) {
        return res
            .status(201)
            .json(
                new ApiResponse(200, {}, "There are no request available yet"),
            );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { groupRequests },
                "Request sent Successfully",
            ),
        );
});

export const handleRequest = asyncHandler(async (req, res) => {
    const { requestId, action } = req.body;

    const request = await db.group_joining_request_details.findUnique({
        where: {
            id: requestId,
        },
        include: {
            group: true,
        },
    });

    if (!request) {
        throw new ApiError(400, "Request Not Found");
    }

    if (action === "ACCEPTED") {
        await db.group_joining_request_details.update({
            where: {
                id: requestId,
            },
            data: {
                status: RequestStatus.ACCEPTED,
                responded_on: new Date(Date.now()),
            },
        });

        await db.student_group_mapping_details.create({
            data: {
                groupId: request.groupId,
                studentId: request.studentId,
                joining_date: new Date(Date.now()),
            },
        });

        await db.student_details.update({
            where: {
                id: request.studentId,
            },
            data: {
                isGroupJoined: true,
            },
        });

        await db.group_user_audit_log.create({
            data: {
                groupId: request.groupId,
                studentId: request.studentId,
                actionType: AuditAction.JOINED,
                remarks: `${request.studentId} has joined group`,
            },
        });
    }

    if (action === "REJECTED") {
        await db.group_joining_request_details.update({
            where: {
                id: requestId,
            },
            data: {
                status: RequestStatus.REJECTED,
                responded_on: new Date(Date.now()),
            },
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(200, { request }, `Request ${action} `));
});

export const getUserHistory = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userHistory = await db.group_user_audit_log.findMany({
        where: {
            studentId: userId,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { userHistory },
                `User History Fetched Successfully `,
            ),
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await db.student_details.update({
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
