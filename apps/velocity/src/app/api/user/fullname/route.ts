import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { fullnameSchema } from "@repo/zod";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const body = await req.json();

        const validationResult = fullnameSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { fullname } = validationResult.data;

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: { fullname: fullname.trim() },
            select: { fullname: true },
        });

        return NextResponse.json(new ApiResponse(200, updatedUser, "Fullname updated successfully"), { status: 200 });
    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while updating fullname"))
    }
}
