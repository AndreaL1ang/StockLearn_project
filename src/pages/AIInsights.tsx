import { Sparkles, TrendingUp, TrendingDown, Target, Brain, AlertTriangle, Lightbulb, BookOpen, Award, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const recommendations = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    action: 'Strong Buy',
    confidence: 92,
    price: 495.22,
    target: 580,
    reasoning: 'AI sector leader with strong fundamentals and momentum',
    timeframe: '3-6 months',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    action: 'Hold',
    confidence: 78,
    price: 379.00,
    target: 410,
    reasoning: 'Solid performance, well-positioned in cloud and AI',
    timeframe: '6-12 months',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    action: 'Consider Selling',
    confidence: 68,
    price: 242.80,
    target: 220,
    reasoning: 'High volatility and overvaluation concerns',
    timeframe: '1-3 months',
  },
];

const riskFactors = [
  {
    title: 'Portfolio Concentration',
    level: 'High',
    score: 72,
    description: 'Your tech holdings represent 68% of total portfolio. Consider diversification.',
    action: 'Rebalance',
  },
  {
    title: 'Market Volatility',
    level: 'Medium',
    score: 45,
    description: 'Current market conditions show moderate volatility. Your beta is 1.35.',
    action: 'Monitor',
  },
  {
    title: 'Sector Risk',
    level: 'Medium',
    score: 52,
    description: 'Heavy exposure to technology sector increases correlation risk.',
    action: 'Diversify',
  },
];

const behavioralInsights = [
  {
    icon: '📊',
    title: 'Trading Pattern',
    insight: 'You tend to sell winners too early. Average hold time for profitable trades: 12 days.',
    recommendation: 'Consider longer hold periods for high-conviction positions.',
  },
  {
    icon: '🎯',
    title: 'Risk Tolerance',
    insight: 'Your actual trading behavior suggests higher risk tolerance than your stated profile.',
    recommendation: 'Review your risk assessment and adjust portfolio accordingly.',
  },
  {
    icon: '⏰',
    title: 'Market Timing',
    insight: 'You make 65% of trades during high-volatility periods.',
    recommendation: 'Consider dollar-cost averaging to reduce timing risk.',
  },
  {
    icon: '💰',
    title: 'Loss Aversion',
    insight: 'You hold losing positions 3x longer than winners (avg 36 days). This suggests strong loss aversion bias.',
    recommendation: 'Set stop-loss rules to prevent emotional attachment to declining positions.',
  },
  {
    icon: '📈',
    title: 'Overconfidence Pattern',
    insight: 'Your portfolio turnover rate is 245%, significantly higher than average (80%). This may indicate overconfidence in market timing.',
    recommendation: 'Reduce trading frequency and focus on long-term strategy.',
  },
  {
    icon: '🎲',
    title: 'Recency Bias',
    insight: '78% of your recent purchases were in sectors that performed well last month, showing recency bias.',
    recommendation: 'Research historical trends and avoid chasing past performance.',
  },
  {
    icon: '🧠',
    title: 'Confirmation Bias',
    insight: 'You spend 4x more time reading bullish news about stocks you own versus bearish perspectives.',
    recommendation: 'Actively seek opposing viewpoints before making decisions.',
  },
  {
    icon: '📉',
    title: 'Panic Selling',
    insight: 'During the last market correction, you sold 40% of holdings near the bottom. Historical data shows recovery typically follows.',
    recommendation: 'Create a written investment plan to follow during volatility.',
  },
  {
    icon: '🎪',
    title: 'Herd Mentality',
    insight: '85% of your trades align with trending social media sentiment, suggesting susceptibility to herd behavior.',
    recommendation: 'Base decisions on fundamental analysis rather than social trends.',
  },
  {
    icon: '⚖️',
    title: 'Position Sizing',
    insight: 'Your average winning position is 4% while losing positions average 8%, indicating poor risk management.',
    recommendation: 'Maintain consistent position sizing regardless of conviction level.',
  },
  {
    icon: '🔄',
    title: 'Disposition Effect',
    insight: 'You realize gains at +8% but losses at -23% on average, classic disposition effect behavior.',
    recommendation: 'Set predetermined exit points for both gains and losses.',
  },
  {
    icon: '🎰',
    title: 'Gambling Tendency',
    insight: '30% of your portfolio is in speculative penny stocks and options. This concentration exceeds recommended levels.',
    recommendation: 'Limit speculative investments to 5-10% of total portfolio.',
  },
];

const learningTopics = [
  {
    title: 'Understanding Beta',
    difficulty: 'Intermediate',
    time: '10 min',
    completed: false,
    description: 'Learn how beta measures stock volatility relative to the market',
  },
  {
    title: 'Portfolio Diversification',
    difficulty: 'Beginner',
    time: '15 min',
    completed: true,
    description: 'Master the fundamentals of building a balanced portfolio',
  },
  {
    title: 'Technical Analysis Basics',
    difficulty: 'Advanced',
    time: '25 min',
    completed: false,
    description: 'Dive into chart patterns, indicators, and trading signals',
  },
];

export function AIInsights() {
  const navigate = useNavigate();
  const [showAllInsights, setShowAllInsights] = useState(false);

  const visibleInsights = showAllInsights ? behavioralInsights : behavioralInsights.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Insights</h1>
            <p className="text-muted-foreground">Personalized analysis and recommendations</p>
          </div>
        </div>
      </motion.div>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Today's AI Summary</h3>
              <p className="text-muted-foreground mb-4">
                Your portfolio is performing well with a 12% gain this week. However, high concentration in tech stocks poses diversification risk. Consider rebalancing with defensive sectors. Market sentiment is cautiously optimistic with potential volatility ahead.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Bullish Trend
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Filter className="w-3 h-3" />
                  Rebalance Needed
                </Badge>
                <Badge variant="secondary">
                  Moderate Risk
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 lg:grid-cols-4 md:inline-grid">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral Insights</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary text-lg">{rec.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{rec.symbol}</h3>
                          <Badge 
                            className={
                              rec.action.includes('Buy') 
                                ? 'bg-emerald-500' 
                                : rec.action === 'Hold' 
                                ? 'bg-blue-500' 
                                : 'bg-orange-500'
                            }
                          >
                            {rec.action}
                          </Badge>
                          <Badge variant="outline">{rec.timeframe}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.name}</p>
                        <p className="text-sm mb-3">{rec.reasoning}</p>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Current Price</p>
                            <p className="font-semibold">${rec.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Price Target</p>
                            <p className="font-semibold text-emerald-600">${rec.target}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Upside</p>
                            <p className="font-semibold text-emerald-600">
                              +{(((rec.target - rec.price) / rec.price) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:text-right space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">AI Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={rec.confidence} className="w-24" />
                          <span className="font-semibold">{rec.confidence}%</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full lg:w-auto"
                        onClick={() => navigate(`/stock/${rec.symbol}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Portfolio Risk Assessment</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
                  <p className="text-3xl font-bold">56</p>
                  <Badge variant="secondary" className="mt-2">Medium Risk</Badge>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Portfolio Beta</p>
                  <p className="text-3xl font-bold">1.35</p>
                  <p className="text-xs text-muted-foreground mt-2">35% more volatile than market</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">VaR (95%)</p>
                  <p className="text-3xl font-bold">-$842</p>
                  <p className="text-xs text-muted-foreground mt-2">Max daily loss estimate</p>
                </div>
              </div>

              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${
                          risk.level === 'High' ? 'text-red-500' : 'text-orange-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{risk.title}</h4>
                          <Badge 
                            variant={risk.level === 'High' ? 'destructive' : 'secondary'}
                            className="mt-1"
                          >
                            {risk.level} Risk
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {risk.action}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={risk.score} className="flex-1" />
                      <span className="text-sm font-medium">{risk.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Behavioral Insights Tab */}
          <TabsContent value="behavioral" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Your Trading Behavior</h3>
              </div>
              
              <div className="space-y-4">
                {visibleInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="p-5 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{insight.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="font-medium text-foreground">Pattern: </span>
                          {insight.insight}
                        </p>
                        <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm">
                            <span className="font-medium">Recommendation: </span>
                            {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!showAllInsights && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllInsights(true)}
                    >
                      Show All Insights
                    </Button>
                  </div>
                )}
                {showAllInsights && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllInsights(false)}
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-6 p-5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h4 className="font-semibold mb-2">💡 Key Takeaway</h4>
                <p className="text-sm text-muted-foreground">
                  Understanding your behavioral patterns can help you make more rational investment decisions. Consider setting up automated rules to counter emotional trading tendencies.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Recommended Learning Path</h3>
                </div>
                <Badge>3 Topics</Badge>
              </div>
              
              <div className="space-y-3">
                {learningTopics.map((topic, index) => (
                  <div 
                    key={index}
                    className={`p-5 rounded-lg border-2 transition-all ${
                      topic.completed 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-secondary/30 border-transparent hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{topic.title}</h4>
                          {topic.completed && (
                            <Badge className="bg-emerald-500">Completed</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="outline">{topic.difficulty}</Badge>
                          <span className="text-muted-foreground">{topic.time}</span>
                        </div>
                      </div>
                      {!topic.completed && (
                        <Button>Start Learning</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Personalized Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      These topics are selected based on your portfolio composition and trading patterns. Completing them will help you make better investment decisions.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}