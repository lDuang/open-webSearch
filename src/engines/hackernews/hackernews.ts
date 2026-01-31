import axios from 'axios';
import { SearchResult } from '../../types.js';

export async function searchHackerNews(query: string, limit: number): Promise<SearchResult[]> {
    const response = await axios.get('https://hn.algolia.com/api/v1/search', {
        params: {
            query: query,
            hitsPerPage: limit,
            tags: 'story'
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    const results: SearchResult[] = response.data.hits.map((hit: any) => ({
        title: hit.title || hit.story_text?.substring(0, 100) || 'No title',
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        description: hit.points ? `${hit.points} points | ${hit.num_comments || 0} comments` : '',
        source: 'Hacker News',
        engine: 'hackernews'
    }));

    return results.slice(0, limit);
}
