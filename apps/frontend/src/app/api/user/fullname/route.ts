import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ApiError, ApiResponse } from "@/utils/backend/apiResponse";
import { getUserId } from "@/utils/backend/auth";

export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { fullname } = await req.json();

    if (!fullname.trim()) return NextResponse.json(new ApiError(400, "Fullname is required"), { status: 400 });

    const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { fullname: fullname.trim() },
        select: { fullname: true },
    });

    return NextResponse.json(new ApiResponse(200, updatedUser, "Fullname updated successfully"), { status: 200 });
}
