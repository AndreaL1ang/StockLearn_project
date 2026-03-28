import { TrendingUp, TrendingDown, DollarSign, Percent, Target, PlusCircle, ArrowRightLeft, X, Download, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const holdings = [
  { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', shares: 25, avgPrice: 165.20, currentPrice: 178.50, value: 4462.50, change: 8.05 },
  { id: 'h2', symbol: 'MSFT', name: 'Microsoft', shares: 15, avgPrice: 350.00, currentPrice: 379.00, value: 5685.00, change: 8.29 },
  { id: 'h3', symbol: 'GOOGL', name: 'Alphabet', shares: 20, avgPrice: 135.00, currentPrice: 141.20, value: 2824.00, change: 4.59 },
  { id: 'h4', symbol: 'TSLA', name: 'Tesla', shares: 10, avgPrice: 250.00, currentPrice: 242.80, value: 2428.00, change: -2.88 },
  { id: 'h5', symbol: 'NVDA', name: 'NVIDIA', shares: 8, avgPrice: 450.00, currentPrice: 495.22, value: 3961.76, change: 10.05 },
];

const sectorData = [
  { id: 's1', name: 'Technology', value: 14533, color: '#3b82f6' },
  { id: 's2', name: 'Healthcare', value: 2500, color: '#10b981' },
  { id: 's3', name: 'Finance', value: 1800, color: '#f59e0b' },
  { id: 's4', name: 'Consumer', value: 1200, color: '#8b5cf6' },
];

const performanceData = [
  { id: 'perf1', month: 'Jan', portfolio: 10000, market: 10000 },
  { id: 'perf2', month: 'Feb', portfolio: 10500, market: 10200 },
  { id: 'perf3', month: 'Mar', portfolio: 10800, market: 10400 },
  { id: 'perf4', month: 'Apr', portfolio: 11200, market: 10600 },
  { id: 'perf5', month: 'May', portfolio: 11800, market: 10800 },
  { id: 'perf6', month: 'Jun', portfolio: 12500, market: 11000 },
];

const tradeHistory = [
  { id: 't1', date: '2024-03-20', type: 'buy', symbol: 'AAPL', shares: 10, price: 178.50, total: 1785.00 },
  { id: 't2', date: '2024-03-18', type: 'sell', symbol: 'TSLA', shares: 5, price: 242.80, total: 1214.00 },
  { id: 't3', date: '2024-03-15', type: 'buy', symbol: 'GOOGL', shares: 8, price: 141.20, total: 1129.60 },
  { id: 't4', date: '2024-03-12', type: 'buy', symbol: 'NVDA', shares: 3, price: 495.22, total: 1485.66 },
  { id: 't5', date: '2024-03-10', type: 'sell', symbol: 'MSFT', shares: 5, price: 379.00, total: 1895.00 },
];

export function Portfolio() {
  const navigate = useNavigate();
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.avgPrice * h.shares), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Manage your investments and track performance</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500 gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Simulation Mode
          </Badge>
          <Button className="gap-2" onClick={() => setShowTradeDialog(true)}>
            <PlusCircle className="w-4 h-4" />
            New Trade
          </Button>
        </div>
      </motion.div>

      {/* New Trade Dialog */}
      <AnimatePresence>
        {showTradeDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTradeDialog(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-xl z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">New Trade</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTradeDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Trade Type */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Trade Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={tradeType === 'buy' ? 'default' : 'outline'}
                      onClick={() => setTradeType('buy')}
                      className="w-full"
                    >
                      Buy
                    </Button>
                    <Button
                      variant={tradeType === 'sell' ? 'default' : 'outline'}
                      onClick={() => setTradeType('sell')}
                      className="w-full"
                    >
                      Sell
                    </Button>
                  </div>
                </div>

                {/* Symbol */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Stock Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g., AAPL, MSFT, TSLA"
                    className="w-full px-4 py-2 bg-secondary/50 rounded-lg border border-border"
                  />
                </div>

                {/* Shares */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Number of Shares</label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full px-4 py-2 bg-secondary/50 rounded-lg border border-border"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Price per Share</label>
                  <input
                    type="number"
                    placeholder="150.00"
                    className="w-full px-4 py-2 bg-secondary/50 rounded-lg border border-border"
                  />
                </div>

                {/* Total */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-bold">$0.00</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTradeDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      // Handle trade submission
                      setShowTradeDialog(false);
                    }}
                  >
                    {tradeType === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Portfolio Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Across {holdings.length} positions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
            <Percent className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">+${totalGain.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-sm text-emerald-600">+{totalGainPercent}%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Cash Available</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">$5,240</p>
          <p className="text-sm text-muted-foreground mt-1">Ready to invest</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Trades</span>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{tradeHistory.length}</p>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-grid">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
          </TabsList>

          {/* Holdings Tab */}
          <TabsContent value="holdings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Holdings List */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Holdings</h3>
                  <div className="space-y-2">
                    {holdings.map((holding) => (
                      <motion.div
                        key={holding.symbol}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => navigate(`/stock/${holding.symbol}`)}
                        className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary">{holding.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="font-semibold">{holding.symbol}</p>
                            <p className="text-sm text-muted-foreground">{holding.shares} shares @ ${holding.avgPrice}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${holding.value.toLocaleString()}</p>
                          <div className="flex items-center gap-1 justify-end">
                            {holding.change > 0 ? (
                              <>
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                                <span className="text-sm text-emerald-600">+{holding.change}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3 h-3 text-red-600" />
                                <span className="text-sm text-red-600">{holding.change}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Allocation Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Sector Allocation</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sectorData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {sectorData.map((sector) => (
                    <div key={sector.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: sector.color }}
                        />
                        <span className="text-sm">{sector.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {((sector.value / totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Portfolio vs Market</h3>
                  <p className="text-sm text-muted-foreground">6 month comparison</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart id="portfolio-performance-chart" data={performanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid key="portfolio-grid" strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    key="portfolio-xaxis"
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    key="portfolio-yaxis"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    key="portfolio-tooltip"
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend key="portfolio-legend" />
                  <Bar 
                    key="portfolio-bar" 
                    dataKey="portfolio" 
                    fill="rgb(5, 150, 105)" 
                    name="Your Portfolio" 
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Bar 
                    key="market-bar" 
                    dataKey="market" 
                    fill="rgb(148, 163, 184)" 
                    name="Market Average" 
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Outperformance</p>
                  <p className="text-2xl font-bold text-emerald-600">+13.6%</p>
                  <p className="text-xs text-muted-foreground mt-1">vs S&P 500</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Best Month</p>
                  <p className="text-2xl font-bold">June</p>
                  <p className="text-xs text-emerald-600 mt-1">+5.9% gain</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">1.82</p>
                  <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="history">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Trade History</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Symbol</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Shares</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.map((trade, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4 text-sm">{trade.date}</td>
                        <td className="py-4">
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => navigate(`/stock/${trade.symbol}`)}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {trade.symbol}
                          </button>
                        </td>
                        <td className="py-4 text-sm">{trade.shares}</td>
                        <td className="py-4 text-sm">${trade.price}</td>
                        <td className="py-4 text-sm font-semibold text-right">${trade.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Simulation Mode Tab */}
          <TabsContent value="simulation">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Simulation Mode</h3>
                  <p className="text-sm text-muted-foreground">Practice trading with virtual money</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Virtual Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">$100,000</p>
                  <p className="text-xs text-muted-foreground mt-1">Starting capital</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-muted-foreground mt-1">Since Feb 2024</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-xs text-emerald-600 mt-1">Above average</p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Learning Progress</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Great job! Your simulated trading shows improvement in risk management. Your average loss has decreased by 15% over the past month.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Management</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Entry Timing</span>
                      <span className="text-sm text-muted-foreground">72%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Position Sizing</span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" onClick={() => navigate('/ai-insights')}>
                View Detailed Learning Feedback
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}