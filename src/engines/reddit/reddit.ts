import axios from 'axios';
import { SearchResult } from '../../types.js';

export async function searchReddit(query: string, limit: number): Promise<SearchResult[]> {
    try {
        const response = await axios.get('https://www.reddit.com/search.json', {
            params: {
                q: query,
                limit: Math.min(limit, 100),
                sort: 'relevance',
                type: 'link'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const results: SearchResult[] = response.data.data.children.map((child: any) => {
            const data = child.data;
            return {
                title: data.title,
                url: data.url,
                description: (data.selftext || '').substring(0, 200),
                source: `r/${data.subreddit} | ⬆ ${data.ups}`,
                engine: 'reddit'
            };
        });

        return results.slice(0, limit);
    } catch (error) {
        console.error('Reddit search failed:', error);
        return [];
    }
}
