# Stock API Integration Guide

## Setup Instructions

### 1. Get Free API Keys

**Alpha Vantage (Recommended for Free Tier)**
- Visit: https://www.alphavantage.co/support/#api-key
- Sign up for free API key (25 requests/day)
- Best for: Real-time quotes, historical data, company info

**Finnhub (Great for News)**
- Visit: https://finnhub.io/register
- Free tier: 60 API calls/minute
- Best for: Company news, profile data, real-time quotes

**Alternative Options:**
- IEX Cloud: https://iexcloud.io/
- Polygon.io: https://polygon.io/
- Twelve Data: https://twelvedata.com/

### 2. Add Your API Keys

Open `/services/stockApi.ts` and replace:
```typescript
const ALPHA_VANTAGE_KEY = 'YOUR_API_KEY_HERE';
const FINNHUB_KEY = 'YOUR_FINNHUB_KEY_HERE';
```

With your actual keys:
```typescript
const ALPHA_VANTAGE_KEY = 'ABC123XYZ789'; // Your actual key
const FINNHUB_KEY = 'def456uvw012'; // Your actual key
```

### 3. Usage Examples

#### Example 1: Fetch Real Stock Quote
```typescript
import { getStockQuote } from '../services/stockApi';

// In your component
const loadStockData = async () => {
  const quote = await getStockQuote('AAPL');
  console.log(quote);
  // { symbol: 'AAPL', price: 178.50, change: 2.40, ... }
};
```

#### Example 2: Update StockDetail Page
```typescript
// In StockDetail.tsx
import { useEffect, useState } from 'react';
import { getStockQuote, getIntradayData, getCompanyNews } from '../services/stockApi';

export function StockDetail() {
  const { symbol } = useParams();
  const [quote, setQuote] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [quoteData, priceData, newsData] = await Promise.all([
          getStockQuote(symbol),
          getIntradayData(symbol),
          getCompanyNews(symbol),
        ]);
        
        setQuote(quoteData);
        setChartData(priceData);
        setNews(newsData);
      } catch (error) {
        console.error('Error loading stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;

  return (
    // Your UI with real data
    <div>
      <h1>{symbol}</h1>
      <p>Price: ${quote.price}</p>
      <p>Change: {quote.changePercent}%</p>
    </div>
  );
}
```

#### Example 3: Search Functionality
```typescript
import { searchStocks } from '../services/stockApi';

const handleSearch = async (query: string) => {
  if (query.length < 2) return;
  
  const results = await searchStocks(query);
  // results = [{ symbol: 'AAPL', name: 'Apple Inc.' }, ...]
  setSearchResults(results);
};
```

### 4. Features Available

✅ **Real-Time Quotes** - Current stock prices
✅ **Historical Data** - Past price data for charts  
✅ **Company Info** - Name, sector, market cap, etc.
✅ **News Feed** - Latest company news with sentiment
✅ **Search** - Find stocks by symbol or name
✅ **Mock Data** - Fallback when API limit reached

### 5. API Rate Limits

**Free Tier Limits:**
- Alpha Vantage: 25 requests/day, 5 per minute
- Finnhub: 60 calls/minute

**Tips to Stay Within Limits:**
1. Cache responses locally (localStorage)
2. Use mock data for development
3. Implement request throttling
4. Consider upgrading for production apps

### 6. Production Recommendations

For a production app, consider:

1. **Backend Proxy** - Hide API keys server-side
2. **Redis Caching** - Cache responses to reduce API calls
3. **WebSockets** - Use Finnhub WebSocket for real-time streaming
4. **Paid Tier** - Upgrade API plan for more requests

### 7. Security Note

⚠️ **Never commit API keys to Git!**

Use environment variables:
```typescript
const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
```

Create `.env` file:
```
VITE_ALPHA_VANTAGE_KEY=your_key_here
VITE_FINNHUB_KEY=your_key_here
```

Add `.env` to `.gitignore`

### 8. Testing

The API service includes mock data fallbacks, so you can test without API keys:
- Functions automatically return mock data if API fails
- Perfect for development and testing
- Replace with real data when keys are added

### 9. Next Steps

1. Get your free API keys
2. Add them to `/services/stockApi.ts`
3. Import and use in your pages
4. Test with real data
5. Implement caching for better performance

## Questions?

Check the API documentation:
- Alpha Vantage: https://www.alphavantage.co/documentation/
- Finnhub: https://finnhub.io/docs/api
