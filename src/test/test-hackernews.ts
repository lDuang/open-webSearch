import { searchHackerNews } from '../engines/hackernews/index.js';

async function testHackerNewsSearch() {
  console.log('🔍 Starting Hacker News search test...');

  try {
    const query = 'rust programming';
    const maxResults = 10;

    console.log(`📝 Search query: ${query}`);
    console.log(`📊 Maximum results: ${maxResults}`);

    const results = await searchHackerNews(query, maxResults);

    console.log(`🎉 Search completed, retrieved ${results.length} results:`);
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   🔗 ${result.url}`);
      console.log(`   📄 ${result.description}`);
      console.log(`   🌐 Source: ${result.source}`);
    });

    return results;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return [];
  }
}

// Run the test
testHackerNewsSearch().catch(console.error);
