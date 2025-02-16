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


        await prisma.$transaction([
            prisma.history.deleteMany({ where: { user_id } }),
            prisma.totalStatistics.updateMany({ where: { user_id }, data: { total_letters_typed: 0, total_tests_taken: 0, total_words_typed: 0 } }),
            prisma.leaderboard.deleteMany({ where: { user_id } }),
        ]);

        return NextResponse.json(new ApiResponse(200, null, "Account stats reset successfully"), { status: 200 });

    } catch {
        return NextResponse.json(new ApiError(500, "Something went wrong while reseting account"))
    }
}
