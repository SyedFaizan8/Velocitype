import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { dpSchema } from "@repo/zod";
import { NextRequest, NextResponse } from "next/server";
import { decryptBackend } from "@/utils/decryptBackend";
import { removeImageFromImagekit } from "@/utils/addTranformation";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const { error, status, decryptedBody } = await decryptBackend(req)
        if (error) {
            return NextResponse.json(
                new ApiError(status, error),
                { status: status }
            );
        }

        const validationResult = dpSchema.safeParse(decryptedBody);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { imageId } = validationResult.data;

        const findUserImage = await prisma.user.findUnique({
            where: { user_id },
            select: { imageId: true }
        })

        if (findUserImage && findUserImage.imageId) {
            await removeImageFromImagekit(findUserImage.imageId);
        }

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: { imageId },
            select: { imageId: true },
        });

        return NextResponse.json(new ApiResponse(200, updatedUser, "Profile picture updated successfully"), { status: 200 });
    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while updating dp"))
    }
}
