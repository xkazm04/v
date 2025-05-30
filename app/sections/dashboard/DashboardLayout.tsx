'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import DashSpeakerProfile from '@/app/sections/dashboard/DashSpeakerProfile';
import DashHistory from '@/app/sections/dashboard/DashHistory';
import DashAnalytics from '@/app/sections/dashboard/DashAnalytics';
import DashTruthTrend from '@/app/sections/dashboard/DashTruthTrend';
import DashBreakdown from '@/app/sections/dashboard/DashBreakdown';
import DashScore from '@/app/sections/dashboard/DashScore';
import DashActivity from '@/app/sections/dashboard/DashActivity';
import DashComparison from '@/app/sections/dashboard/DashComparison';
import { MOCK_SPEAKERS } from '@/app/constants/speakers';

const DashboardLayout = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(MOCK_SPEAKERS[0]);
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Public Figure Analytics
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive fact-checking dashboard for politicians and public speakers. 
            Track truth patterns, analyze statements, and discover credibility insights.
          </p>
        </motion.div>

        {/* Speaker Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex flex-wrap gap-3">
            {MOCK_SPEAKERS.map((speaker) => (
              <button
                key={speaker.id}
                onClick={() => setSelectedSpeaker(speaker)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${selectedSpeaker.id === speaker.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                {speaker.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <DashSpeakerProfile speaker={selectedSpeaker} />
            <DashScore speaker={selectedSpeaker} />
            <DashComparison currentSpeaker={selectedSpeaker} />
          </motion.div>

          {/* Center Column - Main Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <DashAnalytics speaker={selectedSpeaker} timeRange={timeRange} />
            <DashTruthTrend speaker={selectedSpeaker} timeRange={timeRange} />
            <DashBreakdown speaker={selectedSpeaker} />
          </motion.div>

          {/* Right Column - Activity & History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <DashActivity speaker={selectedSpeaker} />
            <DashHistory speaker={selectedSpeaker} />
          </motion.div>
        </div>

        {/* Time Range Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
            {['1month', '3months', '6months', '1year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize
                  ${timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }
                `}
              >
                {range === 'all' ? 'All Time' : range.replace(/(\d+)/, '$1 ')}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;