import {SearchResult} from '../../types.js';
import { config } from '../../config.js';
import {searchDuckDuckGo} from "../duckduckgo/index.js";
import { searchBing } from '../bing/bing.js';

async function searchBingForZhiHu(query: string, limit: number): Promise<SearchResult[]> {
    // Use the main Bing search function
    return searchBing(query, limit);
}


export async function searchZhiHu(query: string, limit: number): Promise<SearchResult[]> {

    console.error(`🔍 Searching zhuanlan.zhihu.com with "${query}" using ${config.defaultSearchEngine} engine`);

    // Create the site-specific query
    const siteQuery = `site:zhuanlan.zhihu.com ${query}`;

    let results: SearchResult[] = [];

    try {
        // Use the configured search engine
        if (config.defaultSearchEngine === 'duckduckgo') {
            results = await searchDuckDuckGo(siteQuery, limit);
        } else {
            // Default to Bing
            results = await searchBingForZhiHu(siteQuery, limit);
        }

        // Filter results to ensure they're from zhuanlan.zhihu.com
        const filteredResults = results.filter(result => {
            try {
                const url = new URL(result.url);
                return url.hostname === 'zhuanlan.zhihu.com';
            } catch {
                return false;
            }
        });

        // Update source to be consistent
        filteredResults.forEach(result => {
            result.source = 'zhuanlan.zhihu.com';
            // Keep the original engine info
        });

        return filteredResults.slice(0, limit);
    } catch (error: any) {
        console.error(`❌ zhuanlan.zhihu.com search failed using ${config.defaultSearchEngine}:`, error.message || error);
        return [];
    }

}
