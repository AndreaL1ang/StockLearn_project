import { Menu, X, Bell, User, Sun, Moon, TrendingUp, Home, Compass, Briefcase, Sparkles, UserCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/ai-insights', label: 'AI Insights', icon: Sparkles },
  { path: '/profile', label: 'Profile', icon: UserCircle },
];

export function FinancialHeader() {
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavItemClick = (path: string) => {
    navigate(path);
    setShowNavMenu(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm border-b' 
          : 'bg-background/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <h1 className="text-base font-semibold">StockLearn</h1>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showNavMenu ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Navigation Dropdown */}
            <AnimatePresence>
              {showNavMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNavMenu(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavItemClick(item.path)}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors ${
                              isActive ? 'bg-secondary/30 text-primary' : ''
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" className="relative w-8 h-8 p-0 hidden lg:flex">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-destructive">2</Badge>
            </Button>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0 hidden lg:flex"
              onClick={() => navigate('/profile')}
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
