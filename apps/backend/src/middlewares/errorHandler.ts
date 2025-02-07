import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse } from "../utils/index";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    const response = new ApiResponse(err.statusCode, null, err.message);
    res.status(err.statusCode).json(response);
  } else {
    const response = new ApiResponse(500, [], "Internal Server Error");
    res.status(500).json(response);
  }
};

export default errorHandler;
