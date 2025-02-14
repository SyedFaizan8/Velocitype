export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { bio } = await req.json();

    if (!bio.trim()) return NextResponse.json(new ApiError(400, "Bio is required"), { status: 400 });

    const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { bio: bio.trim() },
        select: { bio: true },
    });

    return NextResponse.json(new ApiResponse(200, updatedUser, "Bio updated successfully"), { status: 200 });
}
