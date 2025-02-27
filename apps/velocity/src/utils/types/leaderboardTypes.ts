export interface UserNameType {
    username: string;
    imageId: string | null;
}

export interface LeaderboardType {
    user: UserNameType;
    highest_wpm: number;
    highest_accuracy: number;
    achieved_at: Date | string;
}
