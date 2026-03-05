/**
 * Sends a standardized success JSON response.
 */
const sendSuccess = (res, statusCode, data, message = "Success") => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data,
    });
};

/**
 * Sends a standardized paginated JSON response.
 */
const sendPaginated = (res, data, total, page, limit) => {
    return res.status(200).json({
        status: "success",
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

module.exports = { sendSuccess, sendPaginated };
