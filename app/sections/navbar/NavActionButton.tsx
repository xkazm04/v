import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

type ActionButtonsType = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;    
  showOnDesktop: boolean;
  showOnMobile: boolean;
  badge?: number | null;
  className?: string;
};
export const renderActionButton = (config: ActionButtonsType, isMobile = false) => {
    const Icon = config.icon;
    const shouldShow = isMobile ? config.showOnMobile : config.showOnDesktop;

    if (!shouldShow) return null;

    return (
      <motion.div
        key={config.key}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={config.onClick}
          className={cn(
            'relative transition-all duration-200',
            config.className,
            isMobile && 'w-full justify-start gap-3 h-11'
          )}
        >
          <Icon className="h-5 w-5" />
          {isMobile && <span>{config.label}</span>}
          {!isMobile && <span className="sr-only">{config.label}</span>}

          {/* Notification badge */}
          {config.badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium"
            >
              {config.badge > 9 ? '9+' : config.badge}
            </motion.div>
          )}
        </Button>
      </motion.div>
    );
  };