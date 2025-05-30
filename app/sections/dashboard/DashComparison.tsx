'use client';

import { motion } from 'framer-motion';
import { Speaker, MOCK_SPEAKERS } from '@/app/constants/speakers';

interface ComparisonWidgetProps {
  currentSpeaker: Speaker;
}

const DashComparison = ({ currentSpeaker }: ComparisonWidgetProps) => {
  const otherSpeakers = MOCK_SPEAKERS.filter(s => s.id !== currentSpeaker.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Comparison</h3>
      
      <div className="space-y-4">
        {otherSpeakers.map((speaker) => (
          <div key={speaker.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {speaker.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{speaker.name}</div>
                <div className="text-xs text-muted-foreground">{speaker.title}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div
                className={`text-sm font-medium ${
                  speaker.reliabilityScore > currentSpeaker.reliabilityScore
                    ? 'text-green-600'
                    : speaker.reliabilityScore < currentSpeaker.reliabilityScore
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}
              >
                {speaker.reliabilityScore}%
              </div>
              <div className="w-16 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${speaker.reliabilityScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Average Reliability</div>
          <div className="text-lg font-bold text-foreground">
            {Math.round(MOCK_SPEAKERS.reduce((acc, s) => acc + s.reliabilityScore, 0) / MOCK_SPEAKERS.length)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashComparison;