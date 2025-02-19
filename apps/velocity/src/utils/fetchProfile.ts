import axios from 'axios';
import { baseUrl } from '@/utils/constants';
import type { UserData } from '@/utils/types/profileTypes';

export async function fetchProfile(username: string): Promise<UserData> {
    try {
        const response = await axios.get(`${baseUrl}/api/profile`, {
            params: { username },
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Failed to fetch profile data');
        }

        return response.data.data as UserData;
    } catch (error) {
        console.error('Error in fetchProfile:', error);
        throw error;
    }
}
