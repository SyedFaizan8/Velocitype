export async function DELETE(req: NextRequest) {
    const user_id = await getUserId(req);

    await prisma.$transaction([
        prisma.history.deleteMany({ where: { user_id } }),
        prisma.totalStatistics.updateMany({ where: { user_id }, data: { total_letters_typed: 0, total_tests_taken: 0, total_words_typed: 0 } }),
        prisma.leaderboard.deleteMany({ where: { user_id } }),
    ]);

    return NextResponse.json(new ApiResponse(200, "Account stats reset successfully"), { status: 200 });
}
