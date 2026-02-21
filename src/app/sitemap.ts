import { MetadataRoute } from 'next'
import { insforge } from '@/lib/insforge'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://europe-visa-blog.com'

    // Static routes for both languages
    const routes = [
        '',
        '/news',
    ].flatMap((route) => [
        {
            url: `${baseUrl}/en${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/ne${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
    ])

    // Fetch posts for dynamic routes
    const { data: posts } = await insforge.database
        .from('posts')
        .select('slug_en, slug_ne, updated_at')
        .eq('status', 'published')

    const postRoutes = (posts || []).flatMap((post) => {
        const items = []

        if (post.slug_en) {
            items.push({
                url: `${baseUrl}/en/news/${post.slug_en}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })
        }

        if (post.slug_ne) {
            items.push({
                url: `${baseUrl}/ne/news/${post.slug_ne}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })
        }

        return items
    })

    return [...routes, ...postRoutes]
}
