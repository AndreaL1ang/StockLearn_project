// Stock API Service
// This service integrates with financial data APIs
// For production, sign up at: https://www.alphavantage.co/support/#api-key

const ALPHA_VANTAGE_KEY = 'ESSO5FTVMDRPMF2E'; // Get free key from Alpha Vantage
const FINNHUB_KEY = 'd73ku19r01qjjol3djjgd73ku19r01qjjol3djk0'; // Alternative: Get from finnhub.io

// Base URLs
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

// Rate limit tracking
let apiCallCount = 0;
let lastResetTime = Date.now();
const MAX_CALLS_PER_MINUTE = 5;

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

export interface StockProfile {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  beta: number;
  website: string;
  logo: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
}

export interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Alpha Vantage - Get Real-Time Quote
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  // Check rate limit
  if (shouldUseMockData()) {
    console.log(`Using mock data for ${symbol} (rate limit or offline)`);
    return getMockQuote(symbol);
  }

  try {
    const url = `${ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API error messages
    if (data['Error Message']) {
      console.warn('API Error:', data['Error Message']);
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('API Rate Limit:', data['Note']);
      throw new Error('Rate limit exceeded');
    }
    
    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
      const quote = data['Global Quote'];
      incrementApiCall();
      return {
        symbol: quote['01. symbol'] || symbol,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        high: parseFloat(quote['03. high']) || 0,
        low: parseFloat(quote['04. low']) || 0,
        open: parseFloat(quote['02. open']) || 0,
        previousClose: parseFloat(quote['08. previous close']) || 0,
        volume: parseInt(quote['06. volume']) || 0,
      };
    }
    
    throw new Error('Invalid response from API - empty data');
  } catch (error) {
    console.log(`API unavailable for ${symbol}, using mock data:`, error instanceof Error ? error.message : 'Unknown error');
    // Return mock data for demo
    return getMockQuote(symbol);
  }
}

// Alpha Vantage - Get Intraday Chart Data
export async function getIntradayData(symbol: string): Promise<ChartDataPoint[]> {
  if (shouldUseMockData()) {
    console.log(`Using mock chart data for ${symbol}`);
    return getMockChartData();
  }

  try {
    const url = `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Note']) {
      throw new Error('Rate limit exceeded');
    }
    
    if (data['Time Series (5min)']) {
      const timeSeries = data['Time Series (5min)'];
      incrementApiCall();
      return Object.entries(timeSeries).slice(0, 50).map(([timestamp, values]: any) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }));
    }
    
    throw new Error('Invalid response from API');
  } catch (error) {
    console.log(`Chart API unavailable for ${symbol}, using mock data`);
    return getMockChartData();
  }
}

// Alpha Vantage - Get Historical Daily Data
export async function getHistoricalData(symbol: string, period: '1W' | '1M' | '3M' | '1Y' | 'All'): Promise<ChartDataPoint[]> {
  console.log(`Fetching historical data for ${symbol} - ${period}`);
  
  // Always use mock data for historical to avoid rate limits
  return getMockHistoricalData(period);
  
  // Real API implementation (commented out due to rate limits)
  /*
  try {
    const url = `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const days = getPeriodDays(period);
      
      return Object.entries(timeSeries).slice(0, days).map(([timestamp, values]: any) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }));
    }
    
    throw new Error('Invalid response from API');
  } catch (error) {
    console.log(`Historical API unavailable, using mock data`);
    return getMockHistoricalData(period);
  }
  */
}

function getPeriodDays(period: string): number {
  switch (period) {
    case '1W': return 7;
    case '1M': return 30;
    case '3M': return 90;
    case '1Y': return 365;
    case 'All': return 1000;
    default: return 30;
  }
}

// Finnhub - Get Company Profile
export async function getCompanyProfile(symbol: string): Promise<StockProfile> {
  try {
    const url = `${FINNHUB_BASE}/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      symbol: data.ticker,
      name: data.name,
      description: data.description || '',
      sector: data.finnhubIndustry || 'Technology',
      industry: data.finnhubIndustry || '',
      marketCap: formatMarketCap(data.marketCapitalization),
      peRatio: 0, // Need additional API call
      dividendYield: 0,
      beta: 0,
      website: data.weburl,
      logo: data.logo,
    };
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return getMockProfile(symbol);
  }
}

// Finnhub - Get Company News
export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
  try {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const url = `${FINNHUB_BASE}/company-news?symbol=${symbol}&from=${formatDate(lastWeek)}&to=${formatDate(today)}&token=${FINNHUB_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.slice(0, 10).map((item: any, index: number) => ({
      id: `news-${index}`,
      title: item.headline,
      source: item.source,
      url: item.url,
      publishedAt: new Date(item.datetime * 1000).toISOString(),
      sentiment: determineSentiment(item.headline),
      summary: item.summary,
    }));
  } catch (error) {
    console.error('Error fetching company news:', error);
    return getMockNews(symbol);
  }
}

// Search for stocks
export async function searchStocks(query: string): Promise<Array<{ symbol: string; name: string }>> {
  try {
    const url = `${ALPHA_VANTAGE_BASE}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.bestMatches) {
      return data.bestMatches.slice(0, 10).map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

// Helper Functions
function shouldUseMockData(): boolean {
  // Reset counter every minute
  if (Date.now() - lastResetTime > 60000) {
    apiCallCount = 0;
    lastResetTime = Date.now();
  }
  
  // Use mock data if we've exceeded rate limit
  return apiCallCount >= MAX_CALLS_PER_MINUTE;
}

function incrementApiCall(): void {
  apiCallCount++;
}

function formatMarketCap(cap: number): string {
  if (cap >= 1000000) return `${(cap / 1000000).toFixed(1)}T`;
  if (cap >= 1000) return `${(cap / 1000).toFixed(1)}B`;
  return `${cap.toFixed(1)}M`;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function determineSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positive = ['gain', 'profit', 'surge', 'beat', 'upgrade', 'growth'];
  const negative = ['loss', 'drop', 'fall', 'concern', 'downgrade', 'risk'];
  
  const lowerText = text.toLowerCase();
  const hasPositive = positive.some(word => lowerText.includes(word));
  const hasNegative = negative.some(word => lowerText.includes(word));
  
  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}

// Mock Data Functions (for demo/offline mode)
function getMockQuote(symbol: string): StockQuote {
  // Use realistic mock data for common stocks
  const mockStocks: Record<string, StockQuote> = {
    AAPL: {
      symbol: 'AAPL',
      price: 178.50,
      change: 2.30,
      changePercent: 1.31,
      high: 179.20,
      low: 176.80,
      open: 177.50,
      previousClose: 176.20,
      volume: 52340000,
    },
    MSFT: {
      symbol: 'MSFT',
      price: 379.00,
      change: 3.20,
      changePercent: 0.85,
      high: 381.50,
      low: 377.20,
      open: 378.00,
      previousClose: 375.80,
      volume: 28150000,
    },
    GOOGL: {
      symbol: 'GOOGL',
      price: 141.20,
      change: 3.10,
      changePercent: 2.24,
      high: 142.50,
      low: 139.80,
      open: 140.20,
      previousClose: 138.10,
      volume: 31420000,
    },
    TSLA: {
      symbol: 'TSLA',
      price: 242.80,
      change: -5.20,
      changePercent: -2.10,
      high: 248.50,
      low: 241.20,
      open: 246.80,
      previousClose: 248.00,
      volume: 98540000,
    },
    NVDA: {
      symbol: 'NVDA',
      price: 495.22,
      change: 38.50,
      changePercent: 8.42,
      high: 498.50,
      low: 485.20,
      open: 488.00,
      previousClose: 456.72,
      volume: 52300000,
    },
    AMZN: {
      symbol: 'AMZN',
      price: 178.25,
      change: 3.40,
      changePercent: 1.94,
      high: 179.80,
      low: 176.50,
      open: 177.20,
      previousClose: 174.85,
      volume: 42800000,
    },
    META: {
      symbol: 'META',
      price: 486.50,
      change: 24.20,
      changePercent: 5.23,
      high: 489.20,
      low: 478.50,
      open: 480.00,
      previousClose: 462.30,
      volume: 35600000,
    },
    AMD: {
      symbol: 'AMD',
      price: 158.90,
      change: 9.20,
      changePercent: 6.14,
      high: 160.50,
      low: 155.20,
      open: 156.80,
      previousClose: 149.70,
      volume: 48200000,
    },
  };

  // Return predefined mock data or generate random data
  if (mockStocks[symbol]) {
    return mockStocks[symbol];
  }

  // Generate random data for unknown symbols
  const basePrice = 100 + Math.random() * 400;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    symbol,
    price: basePrice,
    change,
    changePercent: (change / basePrice) * 100,
    high: basePrice + Math.random() * 5,
    low: basePrice - Math.random() * 5,
    open: basePrice + (Math.random() - 0.5) * 3,
    previousClose: basePrice - change,
    volume: Math.floor(Math.random() * 50000000),
  };
}

function getMockChartData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = 180 + Math.random() * 20; // Start around 180-200
  
  for (let i = 0; i < 50; i++) {
    const change = (Math.random() - 0.5) * 2;
    price += change;
    
    data.push({
      timestamp: new Date(Date.now() - (50 - i) * 5 * 60 * 1000).toISOString(),
      open: price,
      high: price + Math.random() * 1,
      low: price - Math.random() * 1,
      close: price + change,
      volume: Math.floor(Math.random() * 1000000),
    });
  }
  
  return data;
}

function getMockHistoricalData(period: '1W' | '1M' | '3M' | '1Y' | 'All'): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const days = getPeriodDays(period);
  let price = 180 + Math.random() * 20; // Start around 180-200
  
  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 3; // Larger daily changes
    price += change;
    
    // Ensure price doesn't go too low
    if (price < 50) price = 50 + Math.random() * 20;
    
    const timestamp = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
    
    data.push({
      timestamp,
      open: price,
      high: price + Math.random() * 2,
      low: price - Math.random() * 2,
      close: price,
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    });
  }
  
  return data;
}

function getMockProfile(symbol: string): StockProfile {
  const companies: Record<string, any> = {
    AAPL: { name: 'Apple Inc.', sector: 'Technology', marketCap: '2.8T', pe: 29.5 },
    TSLA: { name: 'Tesla Inc.', sector: 'Automotive', marketCap: '770B', pe: 68.2 },
    GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', marketCap: '1.8T', pe: 26.8 },
    MSFT: { name: 'Microsoft Corp.', sector: 'Technology', marketCap: '2.9T', pe: 35.2 },
  };
  
  const company = companies[symbol] || { name: symbol, sector: 'Technology', marketCap: '100B', pe: 25 };
  
  return {
    symbol,
    name: company.name,
    description: `${company.name} is a leading company in the ${company.sector} sector.`,
    sector: company.sector,
    industry: company.sector,
    marketCap: company.marketCap,
    peRatio: company.pe,
    dividendYield: Math.random() * 3,
    beta: 0.8 + Math.random() * 0.8,
    website: `https://www.${symbol.toLowerCase()}.com`,
    logo: '',
  };
}

function getMockNews(symbol: string): NewsItem[] {
  return [
    {
      id: 'mock1',
      title: `${symbol} Reports Strong Q4 Earnings`,
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      summary: 'Company beats analyst expectations with strong quarterly results.',
    },
    {
      id: 'mock2',
      title: `Analysts Upgrade ${symbol} Price Target`,
      source: 'Reuters',
      url: '#',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      summary: 'Major investment banks raise price targets following earnings.',
    },
  ];
}