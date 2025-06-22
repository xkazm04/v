'use client';

import { memo, useState } from 'react';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import {
  Tabs,
  TabsList,
} from '@/app/components/ui/tabs';
import FloatingIconsConstellation from '@/app/components/ui/Decorative/FloatingIconsConstellation';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '../hooks/use-layout-theme';
import { Globe, Palette, User,} from 'lucide-react';
import VintageTabTrigger from '../components/navigation/VintageTabTrigger';
import VintageBackButton from '../components/ui/Buttons/VintageBackButton';
import SettingTabsContent from './SettingTabsContent';

const SettingsBackground = memo(() => (
  <div
    className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('/background/settings_bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
));

SettingsBackground.displayName = 'SettingsBackground';


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('preferences');
  const { isDark, vintage } = useLayoutTheme();

  const getConstellationVariant = (tab: string) => {
    switch (tab) {
      case 'preferences': return 'preferences';
      case 'appearance': return 'appearance';
      case 'profile': return 'profile';
      default: return 'settings';
    }
  };

  const tabsData = [
    {
      value: 'preferences',
      label: 'Preferences',
      icon: Globe
    },
    {
      value: 'appearance',
      label: 'Appearance',
      icon: Palette
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <div className="flex min-h-screen relative">
      <SettingsBackground />
      <div className={`${isDark ? 'text-white' : 'opacity-30'}`}>
        <FloatingIconsConstellation
          variant={getConstellationVariant(activeTab)}
          className="z-0"
        />
      </div>

      {/* Main Content */}
      <Sidebar />
      <div className="flex-1 max-w-screen-xl mx-auto relative z-10">
        <div className="absolute top-2 left-6 z-50">
          <VintageBackButton />
        </div>
        <div className="space-y-6 pt-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs
              defaultValue="preferences"
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

                  <TabsList className="grid grid-cols-3 lg:w-[600px] bg-transparent p-0 gap-2">
                    {tabsData.map((tab, index) => (
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
              <SettingTabsContent activeTab={activeTab} />
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}