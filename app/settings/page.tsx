'use client';

import { useState } from 'react';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/app/components/ui/tabs';
import SetApearance from '../sections/settings/Appearance/SetApearance';
import SettingLayout from '../sections/settings/Preferences/SettingLayout';
import FloatingIconsConstellation from '@/app/components/ui/Decorative/FloatingIconsConstellation';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('language');

  const getConstellationVariant = (tab: string) => {
    switch (tab) {
      case 'preferences': return 'preferences';
      case 'appearance': return 'appearance';
      case 'profile': return 'profile';
      default: return 'settings';
    }
  };

  return (
    <div className="flex min-h-screen relative">
      <FloatingIconsConstellation 
        variant={getConstellationVariant(activeTab)}
        className="z-0"
      />
      
      {/* Main Content */}
      <Sidebar />
      <div className="flex-1 my-5 max-w-screen-xl mx-auto relative z-10">
        <div className="space-y-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences with intelligent customization
              </p>
          </motion.div>
          
          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs 
              defaultValue="preferences" 
              className="space-y-6"
              onValueChange={setActiveTab}
            >
              {/* Enhanced Tabs List */}
              <div className="flex justify-center">
                <TabsList className="grid grid-cols-3 lg:w-[600px] backdrop-blur-md bg-white/10 dark:bg-black/10 p-2 rounded-2xl">
                  <TabsTrigger 
                    value="preferences" 
                    className="data-[state=active]:bg-gray-500/10 data-[state=active]:backdrop-blur-lg data-[state=active]:border-white/30 rounded-xl transition-all duration-300"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      🌍 Preferences
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance"
                    className="data-[state=active]:bg-gray-500/10 data-[state=active]:backdrop-blur-lg data-[state=active]:border-white/30 rounded-xl transition-all duration-300"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      🎨 Appearance
                    </motion.span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile"
                    className="data-[state=active]:bg-gray-500/10 data-[state=active]:backdrop-blur-lg data-[state=active]:border-white/30 rounded-xl transition-all duration-300"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      👤 Profile
                    </motion.span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Tab Content with Glass Effect */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <TabsContent value="preferences" className="mt-8">
                  <SettingLayout />
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-8">
                  <SetApearance />
                </TabsContent>
                
                <TabsContent value="profile" className="mt-8">
                  <motion.div 
                    className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-3xl border border-white/20 p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center space-y-6">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-6xl"
                      >
                        👤
                      </motion.div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Profile Settings
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Advanced profile management and personalization features are coming soon. 
                        Stay tuned for exciting updates!
                      </p>
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-sm font-medium text-primary">🚀 Coming Soon</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              </motion.div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}