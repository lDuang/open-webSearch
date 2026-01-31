<div align="center">

# Open-WebSearch MCP Server


</div>

A Model Context Protocol (MCP) server based on multi-engine search results, supporting free web search without API keys.

## Features

- **Web Search** - 13 engines (by quality):
    - **High Quality** (Official APIs): GitHub, Stack Overflow, Hacker News
    - **Mainstream**: Bing, Baidu
    - **Communities**: Reddit, CSDN, Juejin(掘金), Zhihu
    - **Privacy**: DuckDuckGo, Brave
    - **AI**: Exa
- **Content Fetching**: CSDN articles, GitHub READMEs, Juejin articles, Zhihu articles, Linux.do posts
- HTTP proxy configuration for accessing restricted resources
- No API keys required
- Configurable result limits and default engine

## TODO
- Support for ~~Bing~~ (already supported), ~~DuckDuckGo~~ (already supported), ~~Exa~~ (already supported), ~~Brave~~ (already supported), Google and other search engines
- Support for more blogs, forums, and social platforms
- Optimize article content extraction, add support for more sites
- ~~Support for GitHub README fetching~~ (already supported)

## Installation Guide

### Quick Start

```bash
# Clone and build
git clone <your-fork>
cd open-webSearch
npm install
npm run build

# Run
node build/index.cjs
```

**Environment Variables:**

| Variable | Default                 | Options | Description |
|----------|-------------------------|---------|-------------|
| `ENABLE_CORS` | `false`                 | `true`, `false` | Enable CORS |
| `CORS_ORIGIN` | `*`                     | Any valid origin | CORS origin configuration |
| `DEFAULT_SEARCH_ENGINE` | `github` | `github`, `stackoverflow`, `hackernews`, `bing`, `baidu`, `reddit`, `csdn`, `juejin`, `zhihu`, `duckduckgo`, `brave`, `exa` | Default search engine (sorted by quality) |
| `USE_PROXY` | `false`                 | `true`, `false` | Enable HTTP proxy |
| `PROXY_URL` | `http://127.0.0.1:7890` | Any valid URL | Proxy server URL |
| `MODE` | `both`                  | `both`, `http`, `stdio` | Server mode: both HTTP+STDIO, HTTP only, or STDIO only |
| `PORT` | `3000`                  | 1-65535 | Server port |
| `ALLOWED_SEARCH_ENGINES` | empty (all available) | Comma-separated engine names | Limit which search engines can be used; if the default engine is not in this list, the first allowed engine becomes the default |
| `MCP_TOOL_SEARCH_NAME` | `search` | Valid MCP tool name | Custom name for the search tool |
| `MCP_TOOL_FETCH_LINUXDO_NAME` | `fetchLinuxDoArticle` | Valid MCP tool name | Custom name for the Linux.do article fetch tool |
| `MCP_TOOL_FETCH_CSDN_NAME` | `fetchCsdnArticle` | Valid MCP tool name | Custom name for the CSDN article fetch tool |
| `MCP_TOOL_FETCH_GITHUB_NAME` | `fetchGithubReadme` | Valid MCP tool name | Custom name for the GitHub README fetch tool |
| `MCP_TOOL_FETCH_JUEJIN_NAME` | `fetchJuejinArticle` | Valid MCP tool name | Custom name for the Juejin article fetch tool |

**Common configurations:**
```bash
# Enable proxy
USE_PROXY=true PROXY_URL=http://127.0.0.1:7890 node build/index.cjs

# Full configuration
DEFAULT_SEARCH_ENGINE=github ENABLE_CORS=true USE_PROXY=true PROXY_URL=http://127.0.0.1:7890 PORT=8080 node build/index.cjs
```

### Local Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```
3. Build the server:
```bash
npm run build
```
4. Add the server to your MCP configuration:

**Cherry Studio:**
```json
{
  "mcpServers": {
    "web-search": {
      "name": "Web Search MCP",
      "type": "streamableHttp",
      "description": "Multi-engine web search with article fetching",
      "isActive": true,
      "baseUrl": "http://localhost:3000/mcp"
    }
  }
}
```

**VSCode (Claude Dev Extension):**
```json
{
  "mcpServers": {
    "web-search": {
      "transport": {
        "type": "streamableHttp",
        "url": "http://localhost:3000/mcp"
      }
    },
    "web-search-sse": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

**Claude Desktop:**
```json
{
  "mcpServers": {
    "web-search": {
      "transport": {
        "type": "streamableHttp",
        "url": "http://localhost:3000/mcp"
      }
    },
    "web-search-sse": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

**NPX Command Line Configuration:**
```json
{
  "mcpServers": {
    "web-search": {
      "args": ["C:/path/to/open-webSearch/build/index.cjs"],
      "command": "node",
      "env": {
        "MODE": "stdio",
        "DEFAULT_SEARCH_ENGINE": "github"
      }
    }
  }
}
```

**Local STDIO Configuration (Windows):**
```json
{
  "mcpServers": {
    "open-websearch-local": {
      "command": "node",
      "args": ["D:/Project/mcp/open-webSearch/build/index.cjs"],
      "env": {
        "MODE": "stdio",
        "DEFAULT_SEARCH_ENGINE": "github"
      }
    }
  }
}
```

## Usage Guide

The server provides six tools: `search`, `fetchGithubReadme`, `fetchCsdnArticle`, `fetchJuejinArticle`, `fetchZhihuArticle`, and `fetchLinuxDoArticle`.

### search Tool Usage

```typescript
{
  "query": string,        // Search query
  "limit": number,        // Optional: Number of results to return (default: 10)
  "engines": string[]     // Optional: Engines to use. Available: github, stackoverflow, hackernews, bing, baidu, reddit, csdn, juejin, zhihu, duckduckgo, brave, exa (default: github)
}
```

Usage example:
```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "search",
  arguments: {
    query: "rust programming",
    limit: 10,
    engines: ["github", "stackoverflow", "hackernews", "bing", "baidu"]
  }
})
```

Response example:
```json
[
  {
    "title": "Example Search Result",
    "url": "https://example.com",
    "description": "Description text of the search result...",
    "source": "Source",
    "engine": "Engine used"
  }
]
```

### fetchCsdnArticle Tool Usage

Used to fetch complete content of CSDN blog articles.

```typescript
{
  "url": string    // URL from CSDN search results using the search tool
}
```

Usage example:
```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchCsdnArticle",
  arguments: {
    url: "https://blog.csdn.net/xxx/article/details/xxx"
  }
})
```

Response example:
```json
[
  {
    "content": "Example search result"
  }
]
```

### fetchLinuxDoArticle Tool Usage

Used to fetch complete content of Linux.do forum articles.

```typescript
{
  "url": string    // URL from linuxdo search results using the search tool
}
```

Usage example:
```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchLinuxDoArticle",
  arguments: {
    url: "https://xxxx.json"
  }
})
```

Response example:
```json
[
  {
    "content": "Example search result"
  }
]
```

### fetchGithubReadme Tool Usage

Used to fetch README content from GitHub repositories.

```typescript
{
  "url": string    // GitHub repository URL (supports HTTPS, SSH formats)
}
```

Usage example:
```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchGithubReadme",
  arguments: {
    url: "https://github.com/your-username/your-repo"
  }
})
```

Supported URL formats:
- HTTPS: `https://github.com/owner/repo`
- HTTPS with .git: `https://github.com/owner/repo.git`
- SSH: `git@github.com:owner/repo.git`
- URLs with parameters: `https://github.com/owner/repo?tab=readme`

Response example:
```json
[
  {
    "content": "<div align=\"center\">\n\n# Open-WebSearch MCP Server..."
  }
]
```

### fetchJuejinArticle Tool Usage

Used to fetch complete content of Juejin articles.

```typescript
{
  "url": string    // Juejin article URL from search results
}
```

Usage example:
```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchJuejinArticle",
  arguments: {
    url: "https://juejin.cn/post/7520959840199360563"
  }
})
```

Supported URL format:
- `https://juejin.cn/post/{article_id}`

Response example:
```json
[
  {
    "content": "🚀 开源 AI 联网搜索工具：Open-WebSearch MCP 全新升级，支持多引擎 + 流式响应..."
  }
]
```

## Usage Limitations

Since this tool works by scraping multi-engine search results, please note the following important limitations:

1. **Rate Limiting**:
    - Too many searches in a short time may cause the used engines to temporarily block requests
    - Recommendations:
        - Maintain reasonable search frequency
        - Use the limit parameter judiciously
        - Add delays between searches when necessary

2. **Result Accuracy**:
    - Depends on the HTML structure of corresponding engines, may fail when engines update
    - Some results may lack metadata like descriptions
    - Complex search operators may not work as expected

3. **Legal Terms**:
    - This tool is for personal use only
    - Please comply with the terms of service of corresponding engines
    - Implement appropriate rate limiting based on your actual use case

4. **Search Engine Configuration**:
   - Default search engine can be set via the `DEFAULT_SEARCH_ENGINE` environment variable
   - Supported engines: bing, duckduckgo, exa, brave
   - The default engine is used when searching specific websites

5. **Proxy Configuration**:
   - HTTP proxy can be configured when certain search engines are unavailable in specific regions
   - Enable proxy with environment variable `USE_PROXY=true`
   - Configure proxy server address with `PROXY_URL`
