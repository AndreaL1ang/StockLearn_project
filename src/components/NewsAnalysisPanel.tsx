import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  BarChart3,
  AlertTriangle,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getReadNews, analyzeNews, clearReadNews, addSampleReadNews, NewsAnalysis } from '../services/newsTracking';

export function NewsAnalysisPanel() {
  const [analyses, setAnalyses] = useState<NewsAnalysis[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add sample data if none exists (for demo purposes)
    addSampleReadNews();
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    setLoading(true);
    const readNews = getReadNews();
    const newsAnalyses = readNews.map(news => analyzeNews(news));
    setAnalyses(newsAnalyses);
    setLoading(false);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all read news history?')) {
      clearReadNews();
      setAnalyses([]);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading news analysis...</p>
        </div>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold">AI News Intelligence</h3>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-2">
            No news articles read yet
          </p>
          <p className="text-sm text-muted-foreground">
            Start exploring stocks and read news articles to see AI-powered historical analysis and predictions
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI News Intelligence</h3>
            <p className="text-xs text-muted-foreground">
              Historical patterns & predictions from your read articles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{analyses.length} Articles</Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-card/50 hover:bg-card transition-colors">
                {/* News Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {analysis.news.symbol}
                      </Badge>
                      <Badge 
                        variant={
                          analysis.news.sentiment === 'positive' 
                            ? 'default' 
                            : analysis.news.sentiment === 'negative'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {analysis.news.sentiment}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(analysis.news.readAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {analysis.news.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {analysis.news.source}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="shrink-0"
                  >
                    {expandedIndex === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Quick Prediction Summary */}
                <div className="flex items-center gap-4 mb-3 p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    {analysis.prediction.direction === 'bullish' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : analysis.prediction.direction === 'bearish' ? (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    ) : (
                      <Minus className="w-5 h-5 text-amber-600" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">AI Prediction</p>
                      <p className="font-semibold text-sm capitalize">
                        {analysis.prediction.direction}
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="font-semibold text-sm">
                      {analysis.prediction.expectedChange}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="font-semibold text-sm">
                      {analysis.prediction.confidence}%
                    </p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground">Timeframe</p>
                    <p className="font-semibold text-sm">
                      {analysis.prediction.timeframe}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Historical Patterns */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <h5 className="font-semibold text-sm">Historical Patterns</h5>
                        </div>
                        <div className="space-y-2">
                          {analysis.historicalPatterns.map((pattern, patternIndex) => (
                            <div 
                              key={patternIndex}
                              className="p-3 rounded-lg bg-secondary/20 border border-border"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="font-medium text-sm mb-1">{pattern.event}</p>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {pattern.date}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {pattern.description}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    pattern.outcome === 'positive'
                                      ? 'default'
                                      : pattern.outcome === 'negative'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className="text-xs shrink-0 ml-2"
                                >
                                  {pattern.outcome}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                <div className="p-2 rounded bg-background/50">
                                  <p className="text-xs text-muted-foreground mb-1">1 Day</p>
                                  <p className={`font-semibold text-sm ${
                                    pattern.priceChange1Day > 0 
                                      ? 'text-emerald-600' 
                                      : pattern.priceChange1Day < 0
                                      ? 'text-red-600'
                                      : 'text-muted-foreground'
                                  }`}>
                                    {pattern.priceChange1Day > 0 ? '+' : ''}{pattern.priceChange1Day}%
                                  </p>
                                </div>
                                <div className="p-2 rounded bg-background/50">
                                  <p className="text-xs text-muted-foreground mb-1">1 Week</p>
                                  <p className={`font-semibold text-sm ${
                                    pattern.priceChange1Week > 0 
                                      ? 'text-emerald-600' 
                                      : pattern.priceChange1Week < 0
                                      ? 'text-red-600'
                                      : 'text-muted-foreground'
                                  }`}>
                                    {pattern.priceChange1Week > 0 ? '+' : ''}{pattern.priceChange1Week}%
                                  </p>
                                </div>
                                <div className="p-2 rounded bg-background/50">
                                  <p className="text-xs text-muted-foreground mb-1">1 Month</p>
                                  <p className={`font-semibold text-sm ${
                                    pattern.priceChange1Month > 0 
                                      ? 'text-emerald-600' 
                                      : pattern.priceChange1Month < 0
                                      ? 'text-red-600'
                                      : 'text-muted-foreground'
                                  }`}>
                                    {pattern.priceChange1Month > 0 ? '+' : ''}{pattern.priceChange1Month}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Analysis */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-primary" />
                          <h5 className="font-semibold text-sm">AI Analysis & Reasoning</h5>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {analysis.prediction.reasoning}
                          </p>
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <h5 className="font-semibold text-sm">Risk Factors</h5>
                        </div>
                        <div className="space-y-2">
                          {analysis.prediction.risks.map((risk, riskIndex) => (
                            <div 
                              key={riskIndex}
                              className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                              <p className="text-xs text-foreground/80">{risk}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}