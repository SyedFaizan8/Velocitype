export async function PATCH(req: NextRequest) {
    const user_id = await getUserId(req);
    const { website } = await req.json();

    if (!website.trim()) return NextResponse.json(new ApiError(400, "Website is required"), { status: 400 });

    const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { website: website.trim() },
        select: { website: true },
    });

    return NextResponse.json(new ApiResponse(200, updatedUser, "Socials updated successfully"), { status: 200 });
}
