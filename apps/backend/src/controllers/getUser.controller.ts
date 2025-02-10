import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError, ApiResponse, asyncHandler, prisma } from "../utils/index";

export const getUser = asyncHandler(async (req: AuthRequest, res) => {
  const user_id = req.user?.user_id;

  try {
    const user = await prisma.user.findUnique({
      where: { user_id },
      select: { user_id: true, username: true, imageUrl: true },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    throw new ApiError(404, "user not found");
  }
});
