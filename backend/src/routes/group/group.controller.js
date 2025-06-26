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
            student_Id: user_id,
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

    return res
        .status(201)
        .json(new ApiResponse(200, newGroup, "Group Created Successfully"));
});
