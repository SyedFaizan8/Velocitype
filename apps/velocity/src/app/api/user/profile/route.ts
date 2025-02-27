import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";

export async function GET(
    req: NextRequest
) {

    const user_id = await getUserIdFromRequest(req);

    if (!user_id) {
        return NextResponse.json(new ApiError(401, "Unauthorized"), {
            status: 401,
        });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json(new ApiError(400, "Username is required"), {
            status: 400,
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                imageId: true,
                fullname: true,
                username: true,
                email: true,
                bio: true,
                website: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "User not found while fetching profile"),
                { status: 404 }
            );
        }

        return NextResponse.json(
            new ApiResponse(200, user, "Profile found successfully"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError
                ? error : new ApiError(500, "Something went wrong while fetching profile"),
            { status: 500 }
        );
    }
}
