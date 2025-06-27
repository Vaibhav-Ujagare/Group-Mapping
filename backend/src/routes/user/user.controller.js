import { db } from "../../db/dbConnection.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { RequestStatus } from "../../generated/prisma/index.js";

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
    // const { selected_cohort } = req.body;
    const selected_cohort = "Web_Dev";

    if (!selected_cohort) {
        throw new ApiError(400, "Please select the cohort");
    }

    const allCohorts = await db.cohort_details.findMany();

    const cohort = await db.cohort_details.findFirst({
        where: {
            cohort_name: selected_cohort,
        },
        select: {
            id: true,
        },
    });

    if (!cohort) {
        throw new ApiError(400, "Cohort Not Found");
    }

    if (selected_cohort === "Web_Dev") {
        await db.student_cohort_mapping_details.create({
            data: {
                studentId: req.user.id,
                cohortId: cohort.id,
            },
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "All Cohort Fetched Successfully"));
});

export const sendJoiningRequest = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    console.log(userId);

    // TODO: check user role if leader don't allow to send the request

    const group = await db.group_details.findFirst({
        where: {
            id: groupId,
        },
    });

    if (!group) {
        throw new ApiError(400, "Group Not Found");
    }

    const newRequest = await db.group_joining_request_details.create({
        data: {
            studentId: req.user.id,
            groupId: groupId,
            status: RequestStatus.REQUESTED,
            request_note_by_student: note,
            requested_on: new Date(Date.now()),
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

    const groupRequests = await db.group_joining_request_details.findMany({
        where: {
            groupId: group.groupId,
        },
    });

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
