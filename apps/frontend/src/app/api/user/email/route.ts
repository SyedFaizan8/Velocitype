export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { email } = await req.json();

    if (!email.trim()) return NextResponse.json(new ApiError(400, "Email is required"), { status: 400 });

    const existingEmail = await prisma.user.findUnique({ where: { email: email.trim() } });
    if (existingEmail) return NextResponse.json(new ApiError(400, "Email already exists"), { status: 400 });

    const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { email: email.trim() },
        select: { email: true },
    });

    return NextResponse.json(new ApiResponse(200, updatedUser, "Email updated successfully"), { status: 200 });
}
