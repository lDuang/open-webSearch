import { searchReddit } from '../engines/reddit/index.js';

async function testRedditSearch() {
  console.log('Starting Reddit search test...');

  try {
    const query = 'rust programming';
    const maxResults = 10;

    console.log(`Search query: ${query}`);
    console.log(`Maximum results: ${maxResults}`);

    const results = await searchReddit(query, maxResults);

    console.log(`Search completed, retrieved ${results.length} results:`);
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Description: ${result.description}`);
      console.log(`   Source: ${result.source}`);
    });

    return results;
  } catch (error) {
    console.error('Test failed:', error);
    return [];
  }
}

testRedditSearch().catch(console.error);
