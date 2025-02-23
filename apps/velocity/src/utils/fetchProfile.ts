import axios from 'axios';
import { baseUrl } from '@/utils/constants';
import type { UserData } from '@/utils/types/profileTypes';

const profileCache = new Map<string, UserData>();

export async function fetchProfile(username: string): Promise<UserData> {

    if (profileCache.has(username)) return profileCache.get(username)!;

    try {
        const response = await axios.get(`${baseUrl}/api/profile`, {
            params: { username },
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Failed to fetch profile data');
        }

        const profileData = response.data.data as UserData;

        profileCache.set(username, profileData)

        return profileData;

    } catch (error) {
        console.error('Error in fetchProfile:', error);
        throw error;
    }
}
