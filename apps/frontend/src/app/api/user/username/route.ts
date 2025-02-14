export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { username } = await req.json();

    if (!username.trim()) return NextResponse.json(new ApiError(400, "Username is required"), { status: 400 });

    const existingUsername = await prisma.user.findUnique({ where: { username: username.trim() } });
    if (existingUsername) return NextResponse.json(new ApiError(400, "Username already exists"), { status: 400 });

    const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { username: username.trim() },
        select: { username: true },
    });

    return NextResponse.json(new ApiResponse(200, updatedUser, "Username updated successfully"), { status: 200 });
}
