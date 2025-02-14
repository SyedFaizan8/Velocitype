export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { imageUrl } = await req.json();

    if (!imageUrl.trim()) return NextResponse.json(new ApiError(400, "Image URL is required"), { status: 400 });

    const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { imageUrl: imageUrl.trim() },
        select: { imageUrl: true },
    });

    return NextResponse.json(new ApiResponse(200, updatedUser, "Profile picture updated successfully"), { status: 200 });
}
