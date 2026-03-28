import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart2, Plus, Star, Sparkles, Info, Newspaper } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { getStockQuote, getIntradayData, getCompanyNews, getHistoricalData, StockQuote, NewsItem, ChartDataPoint } from '../services/stockApi';
import { trackNewsRead } from '../services/newsTracking';

export function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'All'>('1D');
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [quoteData, intradayData, newsData] = await Promise.all([
          getStockQuote(symbol.toUpperCase()),
          getIntradayData(symbol.toUpperCase()),
          getCompanyNews(symbol.toUpperCase())
        ]);
        
        setStockQuote(quoteData);
        setChartData(intradayData);
        setNews(newsData);
      } catch (err) {
        setError('Failed to load stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol]);

  // Fetch chart data when period changes
  useEffect(() => {
    const fetchChartData = async () => {
      if (!symbol || selectedPeriod === '1D') return; // 1D already loaded
      
      setLoadingChart(true);
      try {
        const historicalData = await getHistoricalData(symbol.toUpperCase(), selectedPeriod);
        setChartData(historicalData);
      } catch (err) {
        console.error('Error fetching historical data:', err);
      } finally {
        setLoadingChart(false);
      }
    };
    
    if (selectedPeriod !== '1D') {
      fetchChartData();
    } else if (stockQuote) {
      // Reload intraday data for 1D
      getIntradayData(symbol?.toUpperCase() || '').then(setChartData);
    }
  }, [selectedPeriod, symbol]);

  const handleNewsClick = (newsItem: NewsItem) => {
    if (symbol && stockQuote) {
      trackNewsRead(newsItem, symbol.toUpperCase(), stockQuote.price);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error || !stockQuote) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Button variant="ghost" className="gap-2 mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">{error || 'Stock not found'}</p>
        </Card>
      </div>
    );
  }

  const isPositive = stockQuote.changePercent > 0;
  
  // Transform chart data for Recharts based on period
  const priceData = chartData.map((point, index) => {
    const date = new Date(point.timestamp);
    let timeLabel = '';
    
    if (selectedPeriod === '1D') {
      // Show time for intraday
      timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (selectedPeriod === '1W') {
      // Show day of week
      timeLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (selectedPeriod === '1M' || selectedPeriod === '3M') {
      // Show month and day
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      // Show month and year
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
    
    return {
      time: timeLabel,
      price: point.close,
      id: `p${index}`
    };
  }).reverse().slice(0, selectedPeriod === '1D' ? 30 : chartData.length); // Limit intraday to 30 points

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button 
          variant="ghost" 
          className="gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </motion.div>

      {/* Stock Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{symbol?.slice(0, 2)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{symbol?.toUpperCase()}</h1>
              <p className="text-muted-foreground">{stockQuote.symbol}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">${stockQuote.price.toFixed(2)}</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-xl font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{stockQuote.changePercent.toFixed(2)}%
              </span>
              <span className={`text-sm ml-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                ({isPositive ? '+' : ''}${stockQuote.change.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Star className="w-4 h-4" />
            Watchlist
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Buy
          </Button>
        </div>
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Price Chart</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '3M', '1Y', 'All'].map((period) => (
                <Button
                  key={period}
                  variant={period === selectedPeriod ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setSelectedPeriod(period as '1D' | '1W' | '1M' | '3M' | '1Y' | 'All')}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart id="stock-detail-price-chart" data={priceData}>
              <defs>
                <linearGradient id="stockDetailPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    key="stock-stop1"
                    offset="5%" 
                    stopColor={isPositive ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)'} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    key="stock-stop2"
                    offset="95%" 
                    stopColor={isPositive ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)'} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid key="stock-grid" strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                key="stock-xaxis"
                dataKey="time" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                key="stock-yaxis"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                key="stock-tooltip"
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                key="stock-detail-price-area"
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)'} 
                strokeWidth={2}
                fill="url(#stockDetailPriceGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">High</p>
              <p className="text-xl font-semibold">${stockQuote.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low</p>
              <p className="text-xl font-semibold">${stockQuote.low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Open</p>
              <p className="text-xl font-semibold">${stockQuote.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Volume</p>
              <p className="text-xl font-semibold">{(stockQuote.volume / 1000000).toFixed(2)}M</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Analysis & News */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* AI Analysis */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold">AI Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Sentiment</span>
                <Badge className={isPositive ? 'bg-emerald-500' : 'bg-red-500'}>
                  {isPositive ? 'Bullish' : 'Bearish'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isPositive 
                  ? 'Strong positive momentum with consistent upward trend.' 
                  : 'Current downward pressure, consider waiting for reversal signals.'}
              </p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">Technical Indicators</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Daily range: ${stockQuote.low.toFixed(2)} - ${stockQuote.high.toFixed(2)}. 
                Volume: {(stockQuote.volume / 1000000).toFixed(1)}M shares.
              </p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Risk Assessment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Moderate volatility expected. Consider position sizing based on your risk tolerance.
              </p>
            </div>

            <Button className="w-full" onClick={() => navigate('/ai-insights')}>
              View Detailed Analysis
            </Button>
          </div>
        </Card>

        {/* News */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Latest News</h3>
          </div>
          
          <div className="space-y-3">
            {news.length > 0 ? (
              news.slice(0, 4).map((newsItem, index) => (
                <a 
                  key={newsItem.id}
                  href={newsItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  onClick={() => handleNewsClick(newsItem)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm">{newsItem.title}</h4>
                    <Badge 
                      variant={newsItem.sentiment === 'positive' ? 'default' : 'secondary'}
                      className="text-xs shrink-0"
                    >
                      {newsItem.sentiment}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{newsItem.source}</span>
                    <span>•</span>
                    <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent news available
              </p>
            )}
          </div>

          <Button variant="outline" className="w-full mt-4">
            View All News
          </Button>
        </Card>
      </motion.div>

      {/* Trading Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
          <Tabs defaultValue="buy" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Shares</label>
                  <input 
                    type="number" 
                    defaultValue="10"
                    className="w-full px-4 py-2 bg-secondary/50 rounded-lg border border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Price per Share</label>
                  <input 
                    type="number" 
                    value={stockQuote.price.toFixed(2)}
                    readOnly
                    className="w-full px-4 py-2 bg-secondary/50 rounded-lg border border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Total Cost</label>
                  <input 
                    type="number" 
                    value={(stockQuote.price * 10).toFixed(2)}
                    readOnly
                    className="w-full px-4 py-2 bg-secondary/50 rounded-lg border border-border font-semibold"
                  />
                </div>
              </div>
              <Button className="w-full gap-2" size="lg">
                <Plus className="w-4 h-4" />
                Buy {symbol}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-muted-foreground">You don't own any {symbol} shares</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}