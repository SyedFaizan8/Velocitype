import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { removeImageFromImagekit } from "@/utils/addTranformation";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const findUserImage = await prisma.user.findUnique({
            where: { user_id },
            select: { imageId: true }
        });

        if (findUserImage && findUserImage.imageId) {
            await removeImageFromImagekit(findUserImage.imageId);
            await prisma.user.update({
                where: { user_id },
                data: { imageId: null },
            });
        }

        return NextResponse.json(new ApiResponse(200, {}, "Dp removed successfully"), { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while removing Dp"), { status: 500 });
    }
}
