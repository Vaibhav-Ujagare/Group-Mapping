import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { db } from "../../db/dbConnection.js";

export const createCohort = asyncHandler(async (req, res) => {
    const { cohort_name, cohort_desc } = req.body;
    const user_id = req.user.id;

    try {
        if (!user_id) {
            throw new ApiError(401, "User Not Found");
        }

        const newCohort = await db.cohort_details.create({
            data: {
                cohort_name,
                cohort_desc,
                super_adminId: user_id,
            },
        });

        if (!newCohort) {
            throw new ApiError(401, "Failed to create Cohort");
        }

        return res
            .status(201)
            .json(
                new ApiResponse(200, newCohort, "Cohort Created Successfully"),
            );
    } catch (error) {
        throw new ApiError(400, error || "Error while creating cohort");
    }
});
