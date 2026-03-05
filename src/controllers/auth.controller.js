const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/response");

const authController = {
    register: catchAsync(async (req, res) => {
        const { name, email, password } = req.body;
        const result = await authService.register({ name, email, password });
        sendSuccess(res, 201, result, "Account created successfully");
    }),

    login: catchAsync(async (req, res) => {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        sendSuccess(res, 200, result, "Logged in successfully");
    }),

    getMe: catchAsync(async (req, res) => {
        const user = await authService.getMe(req.user.id);
        sendSuccess(res, 200, { user });
    }),

    updateProfile: catchAsync(async (req, res) => {
        const user = await authService.updateProfile(req.user.id, req.body);
        sendSuccess(res, 200, { user }, "Profile updated successfully");
    }),
};

module.exports = authController;
