import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <Card className="p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
            <Home className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/')} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}