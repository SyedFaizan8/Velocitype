import { Request, Response } from "express";
import { ApiError } from "src/utils/ApiError";
import asyncHandler from "src/utils/asyncHandler";
import { registerSchema } from "@repo/zod";
import { ApiResponse } from "@/utils/ApiResponse";

const registerUser = asyncHandler(async (req: Request, res: Response) => {


    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) return new ApiError(400, validationResult.error.errors[0].message)
    console.log(`validationResult in registerUser route ${validationResult}`);

    const { fullname, username, email, password, confirmPassword } = validationResult.data;

    // TODO: check if user already exists and username 
    // const existedUser = await User.findOne({
    //     $or: [{ username }, { email }]
    // })
    // if (existedUser) throw new ApiError(409, "User with email or username already exists")

    // TODO: hash to password
    //
    // TODO: push to the database
    // const user = await User.create({
    //     fullName,
    //     avatar: avatar.url,
    //     coverImage: coverImage?.url || "",
    //     email,
    //     password,
    //     username: username.toLowerCase()
    // })


    // TODO: find user 
    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )

    // TODO: if not found
    // if (!createdUser) {
    //     throw new ApiError(500, "Something went wrong while registering the user")
    // }
    const createdUser = 1; //TODO: just for no errors remove this later

    // all went successfull
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

});

export default registerUser;
