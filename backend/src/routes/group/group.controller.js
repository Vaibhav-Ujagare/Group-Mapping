import { db } from "../../db/dbConnection.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { UserRole, AuditAction } from "../../generated/prisma/index.js";

export const createGroup = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const user_id = req.user.id;

    const user = await db.student_details.findUnique({
        where: {
            id: user_id,
        },
    });

    console.log(user.email);
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
            canEditNoticeBoard: true,
        },
    });

    const createdNotice = await db.notice_board_details.create({
        data: {
            board_text: "New Notice",
            studentId: user_id,
            groupId: newGroup.id,
        },
    });

    await db.notice_board_audit_log.create({
        data: {
            noticeBoardId: createdNotice.id,
            actionType: "CREATED",
            newText: "New Notice",
            performedById: user_id,
        },
    });

    await db.student_group_mapping_details.create({
        data: {
            groupId: newGroup.id,
            studentId: user_id,
            joining_date: new Date(Date.now()),
        },
    });

    await db.group_user_audit_log.create({
        data: {
            groupId: newGroup.id,
            studentId: user_id,
            actionType: AuditAction.CREATED,
            remarks: `${user.email} has created ${name} group`,
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
            leaving_reason: null,
            removed_reason: null,
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

export const removeGroupMember = asyncHandler(async (req, res) => {
    const { groupId, studentId, note } = req.body;

    if (!groupId) {
        throw new ApiError(400, "Group Not Found");
    }

    if (!note) {
        throw new ApiError(400, "Please add remove note");
    }

    const group = await db.student_group_mapping_details.update({
        where: {
            studentId_groupId: {
                studentId: studentId,
                groupId: groupId,
            },
        },
        data: {
            removed_reason: note,
            removed_date: new Date(Date.now()),
        },
    });

    await db.student_details.update({
        where: { id: studentId },
        data: {
            isGroupJoined: false,
            canCreateGroup: true,
        },
    });

    await db.group_user_audit_log.create({
        data: {
            groupId: groupId,
            studentId: studentId,
            actionType: AuditAction.REMOVED,
            remarks: `${studentId} has removed ${groupId} group`,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { group },
                `Remove Members From Group Successfully`,
            ),
        );
});

export const leaveGroup = asyncHandler(async (req, res) => {
    const { note, groupId } = req.body;
    const studentId = req.user.id;

    if (!note) {
        throw new ApiError(400, "Please add leaving note");
    }

    if (!groupId || !studentId) {
        throw new ApiError(400, "Mission User of Group ID");
    }

    const mapping = await db.student_group_mapping_details.update({
        where: {
            studentId_groupId: {
                studentId,
                groupId,
            },
        },
        data: {
            leaving_reason: note,
            leaving_date: new Date(Date.now()),
        },
    });

    await db.student_details.update({
        where: { id: studentId },
        data: {
            isGroupJoined: false,
            canCreateGroup: true,
        },
    });

    await db.group_user_audit_log.create({
        data: {
            groupId: groupId,
            studentId: studentId,
            actionType: AuditAction.LEFT,
            remarks: `${studentId} has left the group`,
        },
    });

    return res.status(200).json({
        message: "Successfully left the group",
        data: mapping,
    });
});

export const deleteGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.body;
    const studentId = req.user.id;

    const groupMembers = await db.student_group_mapping_details.findMany({
        where: {
            groupId: groupId,
            leaving_reason: null,
        },
        include: {
            student: true,
        },
    });

    if (groupMembers.length === 1) {
        if (groupMembers[0].student.role == "LEADER") {
            await db.student_group_mapping_details.update({
                where: {
                    studentId_groupId: {
                        studentId: studentId,
                        groupId: groupId,
                    },
                },
                data: {
                    removed_reason: "deleting group",
                    removed_date: new Date(Date.now()),
                },
            });

            await db.student_details.update({
                where: {
                    id: studentId,
                },
                data: {
                    role: UserRole.MEMBER,
                    canCreateGroup: true,
                    isGroupJoined: false,
                    canEditNoticeBoard: false,
                },
            });

            await db.group_user_audit_log.create({
                data: {
                    groupId: groupId,
                    studentId: studentId,
                    actionType: AuditAction.REMOVED,
                    remarks: `${studentId} has removed from the group`,
                },
            });
        }
    }

    if (groupMembers.length > 1) {
        throw new ApiError(400, "You can not delete this group");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { groupMembers },
                "Group Deleted Successfully",
            ),
        );
});

export const getGroupHistory = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const groupHistory = await db.group_user_audit_log.findMany({
        where: {
            groupId: groupId,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { groupHistory },
                `Group History Fetched Successfully `,
            ),
        );
});

export const getGroupProfile = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const group = db.group_details.findMany({
        where: {
            id: groupId,
        },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { group },
                `Group Details Fetched Successfully`,
            ),
        );
});
