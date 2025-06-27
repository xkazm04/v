'use client';

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import {
  Tabs,
  TabsList,
} from '@/app/components/ui/tabs';
import VintageTabTrigger from '@/app/components/navigation/VintageTabTrigger';
import VintageBackButton from '@/app/components/ui/Buttons/VintageBackButton';
import { Users, Heart } from 'lucide-react';
import AllProfilesTab from './AllProfilesTab';
import LikedProfilesTab from './LikedProfilesTab';
import { containerVariants, itemVariants } from '@/app/components/animations/variants/votingVariants';

const StatsBackground = memo(() => (
  <div
    className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
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
  const [activeTab, setActiveTab] = useState('all');

  const tabsData = [
    {
      value: 'all',
      label: 'All Profiles',
      icon: Users
    },
    {
      value: 'liked',
      label: 'Liked',
      icon: Heart
    }
  ];

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <StatsBackground />
      <div className="absolute top-6 left-6 z-50">
        <VintageBackButton />
      </div>
      {/* Main Content */}
      <div className="relative z-10 p-6 pt-10 max-w-7xl mx-auto"> 
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs
            defaultValue="all"
            className="space-y-8"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center">
              <motion.div
                className="relative p-2 rounded-2xl"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))'
                    : `linear-gradient(135deg, ${vintage.paper}f0, ${vintage.highlight}80)`,
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.1)'
                    : `2px solid ${vintage.aged}`,
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0,0,0,0.2)'
                    : `0 8px 32px rgba(139, 69, 19, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                  backdropFilter: 'blur(20px)'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Vintage paper texture for light mode */}
                {!isDark && (
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none rounded-2xl"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                        radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px, 25px 25px'
                    }}
                  />
                )}

                <TabsList className="grid grid-cols-2 lg:w-[400px] bg-transparent p-0 gap-2">
                  {tabsData.map((tab) => (
                    <VintageTabTrigger
                      key={tab.value}
                      value={tab.value}
                      label={tab.label}
                      icon={tab.icon}
                      isActive={activeTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                    />
                  ))}
                </TabsList>
              </motion.div>
            </div>

            {/* ✅ Enhanced Tab Content with Animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'all' && <AllProfilesTab />}
                {activeTab === 'liked' && <LikedProfilesTab />}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilesExperimental;