import { TrendingUp, TrendingDown, ArrowRight, DollarSign, Activity, Briefcase, Target, TrendingUpIcon, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getStockQuote, StockQuote } from '../services/stockApi';

const portfolioData = [
  { date: 'Mon', value: 10000, id: 'mon' },
  { date: 'Tue', value: 10250, id: 'tue' },
  { date: 'Wed', value: 10100, id: 'wed' },
  { date: 'Thu', value: 10600, id: 'thu' },
  { date: 'Fri', value: 10450, id: 'fri' },
  { date: 'Sat', value: 10800, id: 'sat' },
  { date: 'Sun', value: 11200, id: 'sun' },
];

const recentActivity = [
  { id: 'act1', type: 'buy', symbol: 'AAPL', shares: 10, price: 178.50, time: '2h ago', profit: null },
  { id: 'act2', type: 'sell', symbol: 'TSLA', shares: 5, price: 242.80, time: '5h ago', profit: 156.20 },
  { id: 'act3', type: 'buy', symbol: 'GOOGL', shares: 8, price: 141.20, time: '1d ago', profit: null },
];

// Portfolio holdings - symbol and number of shares
const PORTFOLIO_HOLDINGS = [
  { symbol: 'AAPL', shares: 25 },
  { symbol: 'MSFT', shares: 15 },
  { symbol: 'GOOGL', shares: 20 },
];

interface HoldingData {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  value: number;
  change: number;
  price: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState<HoldingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        // Fetch real-time quotes for all holdings
        const holdingPromises = PORTFOLIO_HOLDINGS.map(async (holding) => {
          const quote = await getStockQuote(holding.symbol);
          const value = quote.price * holding.shares;
          
          return {
            id: `hold-${holding.symbol}`,
            symbol: holding.symbol,
            name: getCompanyName(holding.symbol),
            shares: holding.shares,
            value,
            change: quote.changePercent,
            price: quote.price
          };
        });
        
        const holdingsData = await Promise.all(holdingPromises);
        setHoldings(holdingsData);
        
        // Calculate total portfolio value
        const totalValue = holdingsData.reduce((sum, h) => sum + h.value, 0);
        setPortfolioValue(totalValue);
        
        // Calculate weighted average change
        const weightedChange = holdingsData.reduce((sum, h) => {
          const weight = h.value / totalValue;
          return sum + (h.change * weight);
        }, 0);
        setPortfolioChange(weightedChange);
        
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolioData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your portfolio performance and market insights</p>
      </motion.div>

      {/* Account Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Portfolio Value</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            {loading ? (
              <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-2xl font-bold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <div className="flex items-center gap-1 text-sm">
                  {portfolioChange > 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={portfolioChange > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {portfolioChange > 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground">today</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Change</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            {loading ? (
              <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {portfolioChange > 0 ? '+' : ''}${((portfolioValue * portfolioChange) / 100).toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  {portfolioChange > 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={portfolioChange > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {portfolioChange > 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground">vs yesterday</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Holdings</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{PORTFOLIO_HOLDINGS.length}</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Active positions</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Watchlist</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">8</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Stocks tracked</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Portfolio Chart & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Portfolio Performance</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <Button variant="outline" size="sm">
                1W
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart id="dashboard-portfolio-chart" data={portfolioData}>
                <defs>
                  <linearGradient id="dashboardPortfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop key="dashboard-stop1" offset="5%" stopColor="rgb(5, 150, 105)" stopOpacity={0.3}/>
                    <stop key="dashboard-stop2" offset="95%" stopColor="rgb(5, 150, 105)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="dashboard-grid" strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  key="dashboard-xaxis"
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  key="dashboard-yaxis"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  key="dashboard-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  key="dashboard-portfolio-area"
                  type="monotone" 
                  dataKey="value" 
                  stroke="rgb(5, 150, 105)" 
                  strokeWidth={2}
                  fill="url(#dashboardPortfolioGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">AI Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm">
                  📈 Your portfolio is performing {portfolioChange > 0 ? (
                    <span className="font-semibold text-emerald-600">above market average</span>
                  ) : (
                    <span className="font-semibold text-red-600">below expectations</span>
                  )} with a {portfolioChange.toFixed(1)}% change today.
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm">
                  💡 Your portfolio has {PORTFOLIO_HOLDINGS.length} active positions with strong tech exposure.
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm">
                  ⚠️ Monitor market volatility. Review your position sizes regularly.
                </p>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/ai-insights')}
              >
                View Full Analysis
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Top Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/stock/${activity.symbol}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'buy' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    }`}>
                      {activity.type === 'buy' ? (
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{activity.symbol}</span>
                        <Badge variant={activity.type === 'buy' ? 'default' : 'secondary'} className="text-xs">
                          {activity.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.shares} shares @ ${activity.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                    {activity.profit && (
                      <p className="text-sm font-medium text-emerald-600">+${activity.profit}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Holdings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Holdings</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio')}>
                View All
              </Button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-secondary/30 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {holdings.map((holding) => (
                  <div 
                    key={holding.symbol}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/stock/${holding.symbol}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary text-sm">{holding.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">{holding.shares} shares @ ${holding.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${holding.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <div className="flex items-center gap-1">
                        {holding.change > 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs text-emerald-600">+{holding.change.toFixed(2)}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-red-600" />
                            <span className="text-xs text-red-600">{holding.change.toFixed(2)}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Helper function
function getCompanyName(symbol: string): string {
  const names: Record<string, string> = {
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corp.',
    GOOGL: 'Alphabet Inc.',
    TSLA: 'Tesla Inc.',
  };
  return names[symbol] || symbol;
}