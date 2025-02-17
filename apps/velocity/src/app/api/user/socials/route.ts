import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { socialSchema } from "@repo/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const body = await req.json();

        const validationResult = socialSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                new ApiError(400, "Invalid input data"),
                { status: 400 }
            );
        }

        const { website } = validationResult.data;

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: { website: website.trim() },
            select: { website: true },
        });

        return NextResponse.json(new ApiResponse(200, updatedUser, "Socials updated successfully"), { status: 200 });

    } catch (error) {
        return NextResponse.json(error instanceof ApiError
            ? error : new ApiError(500, "Something went wrong while updating socials"))
    }
}
