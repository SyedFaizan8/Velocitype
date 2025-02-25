import axios from 'axios';
import { baseUrl } from '@/utils/constants';
import type { UserData } from '@/utils/types/profileTypes';

const profileCache = new Map<string, { data: UserData, timestamp: number }>();
const CACHE_DURATION = 60 * 1000;

export async function fetchProfile(username: string): Promise<UserData> {

    const cachedProfile = profileCache.get(username);
    const now = Date.now();

    if (cachedProfile && (now - cachedProfile.timestamp < CACHE_DURATION)) return cachedProfile.data;

    try {
        const response = await axios.get(`${baseUrl}/api/profile`, { params: { username } });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Failed to fetch profile data');
        }

        const profileData = response.data.data as UserData;

        profileCache.set(username, { data: profileData, timestamp: now });

        return profileData;

    } catch (error) {
        console.error('Error in fetchProfile:', error);
        throw error;
    }
}
