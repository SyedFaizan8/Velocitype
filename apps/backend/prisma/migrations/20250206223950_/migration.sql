-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "History" (
    "history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" DECIMAL(5,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "TotalStatistics" (
    "user_id" INTEGER NOT NULL,
    "total_tests_taken" INTEGER NOT NULL,
    "total_letters_typed" INTEGER NOT NULL,
    "total_words_typed" INTEGER NOT NULL,

    CONSTRAINT "TotalStatistics_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "user_id" INTEGER NOT NULL,
    "highest_wpm" INTEGER NOT NULL,
    "highest_accuracy" DECIMAL(5,2) NOT NULL,
    "achieved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "History_user_id_idx" ON "History"("user_id");

-- CreateIndex
CREATE INDEX "TotalStatistics_user_id_idx" ON "TotalStatistics"("user_id");

-- CreateIndex
CREATE INDEX "Leaderboard_user_id_idx" ON "Leaderboard"("user_id");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TotalStatistics" ADD CONSTRAINT "TotalStatistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
