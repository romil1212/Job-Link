import AppError from "../utils/AppError.js";

const getJwtErrorMessage = (error) => {
  if (error.name === "JsonWebTokenError") {
    return "invalid token";
  }

  if (error.name === "TokenExpiredError") {
    return "token expired";
  }

  return null;
};

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

export function errorHandler(error, req, res, next) {
  const jwtMessage = getJwtErrorMessage(error);
  const statusCode = error.statusCode || error.status || (jwtMessage ? 401 : 500);
  let message = error.isOperational ? error.message : (jwtMessage || "something went wrong");

  if (error.name === "PayloadTooLargeError") {
      message = error.message; // "request entity too large"
  }

  console.error("Request error", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: error.message,
    code: error.code,
    name: error.name,
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
}
