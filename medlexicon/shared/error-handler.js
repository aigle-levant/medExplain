export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const status = Number.isInteger(err.statusCode)
        ? err.statusCode
        : 500;

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        success: false,
        error: {
            code: status >= 500
                ? "INTERNAL_ERROR"
                : err.code || "REQUEST_ERROR",
            message: status >= 500
                ? "An unexpected error occurred"
                : err.message
        }
    });
};