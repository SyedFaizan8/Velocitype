import { ApiError } from "@/utils/ApiError";
import asyncHandler from "@/utils/asyncHandler";
import { ACCESS_SECRET } from "@/utils/constants";
import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req: Request, _, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) throw new ApiError(401, "Unauthorized Request");

    const decodedToken = jwt.verify(token, ACCESS_SECRET);

    //TODO: find the user by decodedTOKEN
    // const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    // if(!user) throw new ApiError(401, "Invalid Access Token");
    // req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token"); // TODO: add error also
  }
});

export default verifyJWT;
