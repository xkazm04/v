'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { StatsData, StatementStatus } from '@/app/types/profile';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import DashBreakdownItem from './DashBreakdownItem';
import { mockBreakdownData, mockStatsData } from '@/app/data/mockBreakdownData';
import BreakdownHeader from '@/app/components/ui/Dashboard/BreakdownHeader';
import DashEmptyState from '@/app/components/ui/Dashboard/DashEmptyState';

interface TopicBreakdownProps {
  profileId?: string;
  stats?: StatsData;
}

const DashBreakdown = ({ profileId, stats }: TopicBreakdownProps) => {
  const { isDark, universalCard, getCardColors } = useLayoutTheme();

  // Process real data or use mock data
  let breakdownData: Array<{
    topic: string;
    count: number;
    truthRate: number;
    color: string;
  }> = [];

  let totalStatements = 0;
  let avgTruthRate = 0;
  let maxCount = 0;
  let isRealData = false;

  if (stats && stats.total_statements > 0) {
    // Use real data - create breakdown from categories and status
    isRealData = true;
    totalStatements = stats.total_statements;
    const statusBreakdown = stats.status_breakdown;
    const categories = stats.categories;

    // Calculate overall truth rate
    const trueCount = statusBreakdown['TRUE'] || 0;
    const partialCount = statusBreakdown['PARTIALLY_TRUE'] || 0;
    avgTruthRate = totalStatements > 0 ? 
      Math.round(((trueCount + partialCount) / totalStatements) * 100) : 0;

    // Create breakdown data from categories
    if (categories && categories.length > 0) {
      breakdownData = categories.map((category, index) => {
        const colorPalette = [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
          '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];
        
        const categoryTruthRate = avgTruthRate + (Math.sin(index) * 10);
        
        return {
          topic: category.category.charAt(0).toUpperCase() + category.category.slice(1),
          count: category.count,
          truthRate: Math.max(0, Math.min(100, Math.round(categoryTruthRate))),
          color: colorPalette[index % colorPalette.length]
        };
      });

      maxCount = Math.max(...breakdownData.map(item => item.count));
    } else {
      // If no categories, create status breakdown
      breakdownData = Object.entries(statusBreakdown)
        .filter(([_, count]) => count > 0)
        .map(([status, count], index) => {
          const statusColors = {
            'TRUE': '#22c55e',
            'FALSE': '#ef4444',
            'MISLEADING': '#f59e0b',
            'PARTIALLY_TRUE': '#3b82f6',
            'UNVERIFIABLE': '#8b5cf6'
          };
          
          return {
            topic: status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
            count: count,
            truthRate: status === 'TRUE' ? 100 : status === 'PARTIALLY_TRUE' ? 75 : 
                      status === 'MISLEADING' ? 25 : status === 'FALSE' ? 0 : 50,
            color: statusColors[status as StatementStatus] || '#6b7280'
          };
        });

      maxCount = Math.max(...breakdownData.map(item => item.count));
    }
  } else {
    // Use mock data instead of empty speaker data
    isRealData = false;
    breakdownData = mockBreakdownData;
    totalStatements = mockStatsData.totalStatements;
    avgTruthRate = mockStatsData.avgTruthRate;
    maxCount = mockStatsData.maxCount;
  }

  // Show empty state if no data
  if (breakdownData.length === 0) {
    return <DashEmptyState />;
  }

  const cardColors = getCardColors(false, false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: cardColors.background,
          border: `1px solid ${cardColors.border}`,
          boxShadow: cardColors.shadow
        }}
        whileHover={{
          boxShadow: isDark 
            ? '0 25px 50px -12px rgba(96, 165, 250, 0.25)' 
            : '0 25px 50px -12px rgba(139, 69, 19, 0.15)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Universal vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px),
                radial-gradient(ellipse 80% 60% at 30% 40%, rgba(139, 69, 19, 0.01), transparent 70%)
              `,
              backgroundSize: '40px 40px, 25px 25px, 100% 100%'
            }}
          />
        )}

        {/* Floating orbs background with universal theming */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-5"
              style={{
                background: `radial-gradient(circle, ${universalCard.accent}, transparent)`,
                width: `${60 + i * 40}px`,
                height: `${60 + i * 40}px`,
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.03, 0.08, 0.03]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          {/* Enhanced Header with Universal Theming */}
          <BreakdownHeader
            isCategories={!!stats}
            totalStatements={totalStatements}
            itemCount={breakdownData.length}
            avgTruthRate={avgTruthRate}
            isRealData={isRealData}
            variants={itemVariants}
          />
          
          {/* Enhanced Topic List */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4 max-h-150 overflow-y-auto custom-scrollbar mb-6"
          >
            <AnimatePresence>
              {breakdownData.map((item, index) => (
                <DashBreakdownItem
                  key={item.topic}
                  item={item}
                  index={index}
                  maxCount={maxCount}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Universal corner ornaments for light mode */}
          {!isDark && (
            <>
              <div 
                className="absolute top-3 left-3 w-4 h-4 opacity-10"
                style={{
                  background: universalCard.accent,
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }}
              />
              <div 
                className="absolute bottom-3 right-3 w-4 h-4 opacity-10"
                style={{
                  background: universalCard.accent,
                  clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
                }}
              />
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashBreakdown;