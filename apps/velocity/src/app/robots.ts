import type { MetadataRoute } from 'next'
import { baseUrl } from '@/utils/constants'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `https://${baseUrl}/sitemap.xml`,
    }
}