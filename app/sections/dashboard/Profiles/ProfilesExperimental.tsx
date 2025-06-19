'use client';

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { profiles_speakers } from '@/app/constants/speakers';
import ProfilesRow from './ProfilesRow';

const StatsBackground = memo(() => (
  <div 
    className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('/background/bg_stats_8.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
));

StatsBackground.displayName = 'StatsBackground';

const ProfilesExperimental: React.FC = () => {
  const { isDark, vintage } = useLayoutTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Technology', 'Politics', 'Science', 'Business', 'Education'];

  const filteredSpeakers = selectedCategory === 'all' 
    ? profiles_speakers 
    : profiles_speakers.filter(speaker => speaker.category === selectedCategory);


  return (
    <div className="relative min-h-screen overflow-hidden">
        <StatsBackground />

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`
                text-4xl font-bold mb-2
                ${isDark ? 'text-white' : vintage.ink}
              `}>
                Liked Profiles
              </h1>
              <p className={`
                text-lg
                ${isDark ? 'text-gray-300' : vintage.faded}
              `}>
               Recent activity
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${selectedCategory === category
                      ? isDark 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-amber-600 text-white shadow-lg'
                      : isDark
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }
                  `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Speaker Rows */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredSpeakers.map((speaker, index) => (
              <ProfilesRow
                key={speaker.id}
                speaker={speaker}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`
            mt-12 text-center text-sm
            ${isDark ? 'text-gray-500' : vintage.faded}
          `}
        >
          <p>Data updated in real-time • Last refresh: {new Date().toLocaleTimeString()}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilesExperimental;