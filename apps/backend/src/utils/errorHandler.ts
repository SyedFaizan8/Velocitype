import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
