import { TrendingUp, TrendingDown, DollarSign, Filter, Search, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getStockQuote, StockQuote } from '../services/stockApi';
import { NewsAnalysisPanel } from '../components/NewsAnalysisPanel';

// Popular symbols to fetch
const TRENDING_SYMBOLS = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD'];

const sectors = [
  { name: 'Technology', change: 2.4, icon: '💻' },
  { name: 'Healthcare', change: 1.2, icon: '🏥' },
  { name: 'Finance', change: -0.5, icon: '🏦' },
  { name: 'Energy', change: 3.1, icon: '⚡' },
  { name: 'Consumer', change: 0.8, icon: '🛒' },
  { name: 'Industrial', change: -0.3, icon: '🏭' },
];

interface StockData extends StockQuote {
  name: string;
  volume: string;
  sector: string;
}

export function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        // Fetch quotes for all trending stocks in parallel
        const stockPromises = TRENDING_SYMBOLS.map(async (symbol) => {
          const quote = await getStockQuote(symbol);
          return {
            ...quote,
            name: getCompanyName(symbol),
            volume: formatVolume(quote.volume),
            sector: getSector(symbol)
          };
        });
        
        const stockData = await Promise.all(stockPromises);
        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort stocks by change percent
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">Explore Markets</h1>
        <p className="text-muted-foreground">Discover and analyze stocks with AI-powered insights</p>
      </motion.div>

      {/* Market Sectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Market Sectors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {sectors.map((sector) => (
              <button
                key={sector.name}
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all hover:scale-105"
              >
                <div className="text-2xl mb-2">{sector.icon}</div>
                <p className="text-sm font-medium mb-1">{sector.name}</p>
                <div className="flex items-center justify-center gap-1">
                  {sector.change > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">+{sector.change}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <span className="text-xs text-red-600">{sector.change}%</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* AI News Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <NewsAnalysisPanel />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="trending" className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-grid">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Trending Stocks</h3>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Live
                </Badge>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading stocks...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredStocks.map((stock, index) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="font-bold text-primary">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{stock.symbol}</p>
                            <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                          <p className="text-sm text-muted-foreground">Volume</p>
                          <p className="font-medium">{stock.volume}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${stock.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 justify-end">
                            {stock.changePercent > 0 ? (
                              <>
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                                <span className="text-sm text-emerald-600">+{stock.changePercent.toFixed(2)}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3 h-3 text-red-600" />
                                <span className="text-sm text-red-600">{stock.changePercent.toFixed(2)}%</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden lg:flex">
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="gainers">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Gainers Today</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading gainers...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {topGainers.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer border border-emerald-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${stock.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 justify-end">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-600">+{stock.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="losers">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Losers Today</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading losers...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {topLosers.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <span className="font-bold text-red-700 dark:text-red-400">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${stock.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 justify-end">
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          <span className="text-sm font-medium text-red-600">{stock.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="watchlist">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Watchlist</h3>
                <Badge variant="secondary">0 Stocks</Badge>
              </div>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Your watchlist is empty. Click the star icon on any stock to add it to your watchlist.
                </p>
                <Button onClick={() => navigate('/explore')}>
                  Explore Stocks
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold">AI Recommendations</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Based on your portfolio and market trends, we recommend exploring these opportunities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {!loading && stocks.slice(0, 3).map((stock) => (
              <button 
                key={stock.symbol}
                className="p-4 bg-white dark:bg-card rounded-lg text-left hover:scale-105 transition-transform"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <p className="font-semibold mb-1">{stock.symbol}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {stock.changePercent > 0 ? 'Strong upward momentum' : 'Potential buying opportunity'}
                </p>
                <Badge className="text-xs">
                  {stock.changePercent > 5 ? 'High Confidence' : 'Medium Confidence'}
                </Badge>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper functions
function getCompanyName(symbol: string): string {
  const names: Record<string, string> = {
    NVDA: 'NVIDIA Corp',
    TSLA: 'Tesla Inc',
    AAPL: 'Apple Inc',
    MSFT: 'Microsoft Corp',
    GOOGL: 'Alphabet Inc',
    AMZN: 'Amazon.com Inc',
    META: 'Meta Platforms',
    AMD: 'AMD Inc'
  };
  return names[symbol] || symbol;
}

function formatVolume(volume: number): string {
  return `${(volume / 1000000).toFixed(1)}M`;
}

function getSector(symbol: string): string {
  const sectors: Record<string, string> = {
    NVDA: 'Technology',
    TSLA: 'Automotive',
    AAPL: 'Technology',
    MSFT: 'Technology',
    GOOGL: 'Technology',
    AMZN: 'E-commerce',
    META: 'Technology',
    AMD: 'Technology'
  };
  return sectors[symbol] || 'Technology';
}