import { Home, Compass, Briefcase, Brain, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Portfolio', icon: Briefcase, path: '/portfolio' },
    { name: 'AI Insights', icon: Brain, path: '/ai-insights' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span 
                className={`text-xs mt-1 transition-colors ${
                  active ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}