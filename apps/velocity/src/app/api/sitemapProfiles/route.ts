import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ApiError } from "@/utils/apiResponse";

export async function GET() {
    try {
        const sitemapProfile = await prisma.user.findMany({
            take: 10000,
            select: {
                username: true,
                imageId: true,
            },
        });

        return NextResponse.json(
            new ApiResponse(200, sitemapProfile, "sitemapProfile data found"),
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError ? error
                : new ApiError(500, "Something went wrong while fetching sitemap Profile"),
            { status: 500 }
        );
    }
}
