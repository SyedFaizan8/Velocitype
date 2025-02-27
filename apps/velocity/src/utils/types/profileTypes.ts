
export interface UserStats {
    total_tests_taken: number;
    total_letters_typed: number;
    total_words_typed: number;
}

export interface HistoryEntry {
    wpm: number;
    date: string;
}

export interface HighestRank {
    highest_wpm: number;
    highest_accuracy: number;
    achieved_at: Date | string;
}

export interface User {
    imageId: string;
    fullname: string;
    username: string;
    created_at: string | Date;
    bio: string;
    website: string;
    stats: UserStats;
    leaderboard: null | HighestRank;
    history: null | HistoryEntry[];
}

export interface UserData {
    user: User;
    userRank: null | number;
}