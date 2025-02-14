export async function DELETE(req: NextRequest) {
    const user_id = await getUserId(req);

    await prisma.user.delete({ where: { user_id } });

    return NextResponse.json(new ApiResponse(200, "User account deleted successfully"), { status: 200 });
}
