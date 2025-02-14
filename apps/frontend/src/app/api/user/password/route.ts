export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword.trim() || !newPassword.trim()) return NextResponse.json(new ApiError(400, "Password is required"), { status: 400 });

    const user = await prisma.user.findUnique({ where: { user_id }, select: { password: true } });
    if (!user) return NextResponse.json(new ApiError(404, "User not found"), { status: 404 });

    const isPasswordValid = await comparePassword(oldPassword.trim(), user.password);
    if (!isPasswordValid) return NextResponse.json(new ApiError(401, "Incorrect old password"), { status: 401 });

    const hashedPassword = await hashPassword(newPassword.trim());

    await prisma.user.update({ where: { user_id }, data: { password: hashedPassword } });

    return NextResponse.json(new ApiResponse(200, "Password updated successfully"), { status: 200 });
}
