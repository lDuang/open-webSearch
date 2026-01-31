import axios from 'axios';
import { SearchResult } from '../../types.js';

export async function searchStackOverflow(query: string, limit: number): Promise<SearchResult[]> {
    try {
        // Use Stack Exchange API
        const response = await axios.get('https://api.stackexchange.com/2.3/search/advanced', {
            params: {
                order: 'desc',
                sort: 'relevance',
                q: query,
                site: 'stackoverflow',
                pagesize: Math.min(limit, 100)
            },
            headers: {
                'User-Agent': 'StackOverflowSearch/1.0'
            }
        });

        const results: SearchResult[] = response.data.items.map((item: any) => ({
            title: item.title,
            url: item.link,
            description: item.excerpt?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
            source: `Score: ${item.score} | Answers: ${item.answer_count || 0}`,
            engine: 'stackoverflow'
        }));

        return results.slice(0, limit);
    } catch (error) {
        console.error('Stack Overflow search failed:', error);
        return [];
    }
}
