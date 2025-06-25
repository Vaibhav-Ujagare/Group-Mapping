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

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
});
