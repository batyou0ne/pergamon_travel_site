const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const prisma = require("../config/prisma");

/**
 * Protects routes by verifying the JWT token.
 */
const protect = catchAsync(async (req, res, next) => {
    // 1) Extract token from Authorization header
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in. Please log in to get access.", 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
    });

    if (!currentUser) {
        return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    // 4) Attach user to request
    req.user = currentUser;
    next();
});

/**
 * Restricts access to specific roles.
 */
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
};

module.exports = { protect, restrictTo };
