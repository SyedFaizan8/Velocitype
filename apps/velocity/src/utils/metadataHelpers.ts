import type { Metadata } from 'next';
import type { UserData } from '@/utils/types/profileTypes';
import { baseUrl } from '@/utils/constants';
import { isAxiosError } from 'axios';
import { fetchProfile } from './fetchProfile';

export async function getProfileMetadata(profile: string): Promise<Metadata> {
    try {
        const userData: UserData = await fetchProfile(profile)
        const user = userData.user;

        const title = user.fullname
            ? `${user.fullname} (@${user.username}) | Velocitype`
            : `Profile | Velocitype`;
        const description = `View ${user.username}'s profile on Velocitype.`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [
                    {
                        url:
                            user.imageUrl ||
                            `${baseUrl}/images/logo_blue.png`,
                        alt: `${user.fullname || user.username}'s profile picture`,
                    },
                ],
                url: `${baseUrl}/user/profile/${user.username}`,
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [
                    {
                        url:
                            user.imageUrl ||
                            `${baseUrl}/images/logo_blue.png`,
                        alt: `${user.fullname || user.username}'s profile picture`,
                    },
                ],
            },
        };
    } catch (error) {
        console.error('Error generating profile metadata:', error);
        if (isAxiosError(error)) console.log("something went wrong in metadat", error)
        return {
            title: 'Profile | Velocitype',
            description: 'Profile page on Velocitype',
        };
    }
}
