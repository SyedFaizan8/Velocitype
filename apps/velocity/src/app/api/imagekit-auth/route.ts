import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, ApiError } from '@/utils/apiResponse';
import imagekit from '@/utils/imagekit';
import { getUserIdFromRequest } from '@/utils/auth';

export async function GET(req: NextRequest) {
    try {
        const user_id = await getUserIdFromRequest(req);

        if (!user_id) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), {
                status: 401,
            });
        }

        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(
            new ApiResponse(200, authParams, "Imagekit authentication successful"),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            error instanceof ApiError
                ? error
                : new ApiError(500, "Something went wrong while ImageKit authentication"),
            { status: 500 }
        );
    }
}
