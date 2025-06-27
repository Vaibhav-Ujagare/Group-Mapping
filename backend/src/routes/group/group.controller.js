import { db } from "../../db/dbConnection.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { UserRole } from "../../generated/prisma/index.js";

export const createGroup = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const user_id = req.user.id;

    const user = await db.student_details.findUnique({
        where: {
            id: user_id,
        },
    });

    if (!user.canCreateGroup) {
        throw new ApiError(400, "You already create group or part of group");
    }

    if (!name || !description) {
        throw new ApiError(400, "name of description cannot be empty");
    }

    const newGroup = await db.group_details.create({
        data: {
            group_name: name,
            group_desc: description,
            createdById: user_id,
        },
    });

    await db.student_details.update({
        where: { id: user_id },
        data: {
            role: UserRole.LEADER,
            canCreateGroup: false,
            isGroupJoined: true,
        },
    });

    await db.student_group_mapping_details.create({
        data: {
            groupId: newGroup.id,
            studentId: user_id,
            joining_date: new Date(Date.now()),
        },
    });

    return res
        .status(201)
        .json(new ApiResponse(200, newGroup, "Group Created Successfully"));
});

export const getAllGroups = asyncHandler(async (req, res) => {
    const allGroups = await db.group_details.findMany({
        include: {
            createdBy: {
                select: {
                    id: true,
                },
            },
        },
    });

    console.log(allGroups);

    return res
        .status(201)
        .json(
            new ApiResponse(200, allGroups, "Fetched All Groups Successfully"),
        );
});

export const getAllGroupMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    console.log(groupId);

    const groupMembers = await db.student_group_mapping_details.findMany({
        where: {
            groupId: groupId,
        },
        include: {
            student: true,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { groupMembers },
                "Fetched All Group Members Successfully",
            ),
        );
});
