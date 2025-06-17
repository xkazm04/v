import { motion } from 'framer-motion';
import { Speaker, MOCK_SPEAKERS } from '@/app/constants/speakers';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  Users, 
  Star,
} from 'lucide-react';
import { useState } from 'react';
import DashProgressBar from '@/app/components/ui/Dashboard/DashProgressBar';

interface ComparisonWidgetProps {
  currentSpeaker: Speaker;
}

const DashComparison = ({ currentSpeaker }: ComparisonWidgetProps) => {
  const { colors, isDark } = useLayoutTheme();
  const [hoveredSpeaker, setHoveredSpeaker] = useState<string | null>(null);
  
  // Show more speakers (up to 8) with thinner rows
  const speakersToShow = MOCK_SPEAKERS.slice(0, 8);
  const averageScore = Math.round(MOCK_SPEAKERS.reduce((acc, s) => acc + s.reliabilityScore, 0) / MOCK_SPEAKERS.length);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  // Enhanced progress bar component with pattern and overlay

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6"
      style={{
        background: `linear-gradient(135deg, 
          ${isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'} 0%, 
          ${isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(241, 245, 249, 0.9)'} 100%)`,
        borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
        boxShadow: `0 20px 40px -12px ${colors.primary}10`
      }}
    >      
      <div className="relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
                border: `1px solid ${colors.primary}30`
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Users className="h-5 w-5" style={{ color: colors.primary }} />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-bold text-foreground">Comparison</h3>
              <p className="text-xs text-muted-foreground">
                TBD
              </p>
            </div>
          </div>

          {/* Current speaker score pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${getScoreColor(currentSpeaker.reliabilityScore)}20, ${getScoreColor(currentSpeaker.reliabilityScore)}10)`,
              border: `1px solid ${getScoreColor(currentSpeaker.reliabilityScore)}30`
            }}
          >
            <Star className="w-3 h-3" style={{ color: getScoreColor(currentSpeaker.reliabilityScore) }} />
            <span className="text-xs font-bold" style={{ color: getScoreColor(currentSpeaker.reliabilityScore) }}>
              {currentSpeaker.reliabilityScore}%
            </span>
          </div>
        </div>
        
        {/* Comparison list with thinner rows */}
        <div className="space-y-2">
          {speakersToShow.map((speaker, index) => {
            const isCurrentSpeaker = speaker.id === currentSpeaker.id;
            
            return (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredSpeaker(speaker.id)}
                onMouseLeave={() => setHoveredSpeaker(null)}
                className="group relative cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className="grid grid-cols-12 gap-3 items-center p-2.5 rounded-lg border transition-all duration-300"
                  style={{
                    background: isCurrentSpeaker
                      ? `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`
                      : hoveredSpeaker === speaker.id
                        ? `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'}, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'})`
                        : `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'}, ${isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.005)'})`,
                    borderColor: isCurrentSpeaker 
                      ? `${colors.primary}40`
                      : hoveredSpeaker === speaker.id
                        ? `${colors.primary}30`
                        : 'transparent'
                  }}
                >
                  {/* Speaker info - compact */}
                  <div className="col-span-8 flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0"
                    >
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-semibold truncate ${isCurrentSpeaker ? 'text-primary' : 'text-foreground'}`}>
                          {speaker.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{speaker.title}</div>
                    </div>
                  </div>
                  {/* Reliability Score */}
                  <div className="col-span-4">
                    <div className="text-xs text-muted-foreground mb-1">Reliability</div>
                    <DashProgressBar 
                      value={speaker.reliabilityScore} 
                      color={getScoreColor(speaker.reliabilityScore)}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DashComparison;