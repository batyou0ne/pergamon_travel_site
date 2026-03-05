const AppError = require("../utils/AppError");

const handlePrismaError = (err) => {
    // Unique constraint violation
    if (err.code === "P2002") {
        const field = err.meta?.target?.[0] || "field";
        return new AppError(`A record with this ${field} already exists.`, 409);
    }
    // Record not found
    if (err.code === "P2025") {
        return new AppError("The requested record was not found.", 404);
    }
    // Foreign key constraint
    if (err.code === "P2003") {
        return new AppError("Referenced record does not exist.", 400);
    }
    return new AppError("Database error occurred.", 500);
};

const handleJWTError = () =>
    new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
    new AppError("Your token has expired. Please log in again.", 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error("UNEXPECTED ERROR:", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong. Please try again later.",
        });
    }
};

/**
 * Global Express error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = { ...err, message: err.message };

        if (err.name === "PrismaClientKnownRequestError") error = handlePrismaError(err);
        if (err.name === "JsonWebTokenError") error = handleJWTError();
        if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

module.exports = errorHandler;
