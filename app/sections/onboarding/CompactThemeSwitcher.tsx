import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface CompactThemeSwitcherProps {
  value: 'light' | 'dark';
  onChange: (theme: 'light' | 'dark') => void;
  className?: string;
}

const CompactThemeSwitcher: React.FC<CompactThemeSwitcherProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const { colors } = useLayoutTheme();

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1 rounded-lg border" style={{ borderColor: colors.border }}>
        <motion.button
          onClick={() => onChange('light')}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-xs min-w-[200px] font-medium transition-all duration-200 ${
            value === 'light' ? 'text-white' : 'hover:scale-105'
          }`}
          style={{
            background: value === 'light' 
              ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
              : 'transparent',
            color: value === 'light' ? 'white' : colors.foreground
          }}
          whileHover={{ scale: value === 'light' ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sun className="w-3 h-3" />
          <span>Light</span>
        </motion.button>
        
        <motion.button
          onClick={() => onChange('dark')}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-md min-w-[200px] text-xs font-medium transition-all duration-200 ${
            value === 'dark' ? 'text-white' : 'hover:scale-105'
          }`}
          style={{
            background: value === 'dark' 
              ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
              : 'transparent',
            color: value === 'dark' ? 'white' : colors.foreground
          }}
          whileHover={{ scale: value === 'dark' ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Moon className="w-3 h-3" />
          <span>Dark</span>
        </motion.button>
      </div>
    </div>
  );
};

export default CompactThemeSwitcher;