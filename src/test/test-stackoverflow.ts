import { searchStackOverflow } from '../engines/stackoverflow/index.js';

async function testStackOverflowSearch() {
  console.log('Starting Stack Overflow search test...');

  try {
    const query = 'rust async await';
    const maxResults = 10;

    console.log(`Search query: ${query}`);
    console.log(`Maximum results: ${maxResults}`);

    const results = await searchStackOverflow(query, maxResults);

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

testStackOverflowSearch().catch(console.error);
