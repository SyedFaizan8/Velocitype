import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { emailSchema } from "@repo/zod";
import { ApiResponse, ApiError } from "@/utils/apiResponse";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        const validation = emailSchema.safeParse({ email });
        if (!validation.success) {
            return NextResponse.json(new ApiError(400, "Validation failed"), { status: 400 });
        }

        const trimmedEmail = validation.data.email.trim();

        const user = await prisma.user.findUnique({
            where: { email: trimmedEmail },
        });

        return NextResponse.json(
            new ApiResponse(200, { available: user === null }, "Email availability check successful"),
            { status: 200 }
        );
    } catch {
        return NextResponse.json(new ApiError(500, "Internal server error while checking email"), {
            status: 500,
        });
    }
}
