import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ApiError, ApiResponse } from "@/utils/backend/apiResponse";

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    const { username } = params;
    if (!username) {
        return NextResponse.json(new ApiError(400, "Username is required"), {
            status: 400,
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                imageUrl: true,
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
            new ApiError(500, "Something went wrong while fetching profile"),
            { status: 500 }
        );
    }
}
