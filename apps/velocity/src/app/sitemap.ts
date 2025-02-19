import { baseUrl } from '@/utils/constants'
import { profiles } from '@/utils/sitemapData'
import type { MetadataRoute } from 'next'

interface profileDataType {
    username: string
    imageUrl: string
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    try {
        const profileData = await profiles()

        if (!Array.isArray(profileData)) {
            throw new Error('Invalid data format for profiles');
        }

        const searchProfilePages: MetadataRoute.Sitemap = profileData.map(({ username, imageUrl }: profileDataType) => ({
            url: `${baseUrl}/velocitype/user/${username}`,
            lastModified: new Date(),
            changedFrequency: 'weekly',
            images: [imageUrl]
        }))

        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 1,
                images: [`${baseUrl}/images/home.webp`],
            },
            {
                url: `${baseUrl}/velocity/information`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                images: [`${baseUrl}/images/info.webp`],
            },
            {
                url: `${baseUrl}/velocity/leaderboard`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
            },
            ...searchProfilePages
        ]
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return [];
    }
}