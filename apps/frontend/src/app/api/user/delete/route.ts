import { ApiError, ApiResponse } from "@/utils/apiResponse";
import { getUserIdFromRequest } from "@/utils/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        await prisma.user.delete({ where: { user_id } });

        return NextResponse.json(new ApiResponse(200, null, "User account deleted successfully"), { status: 200 });
    } catch {
        return NextResponse.json(new ApiError(500, "Something went wrong while deleting account"))
    }
}
