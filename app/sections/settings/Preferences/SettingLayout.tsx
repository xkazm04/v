'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import SettingLanguage from './SettingLanguage';
import SettingCountry from './SettingCountry';

import Divider from '@/app/components/ui/divider';
import { itemVariants } from '@/app/components/animations/variants/votingVariants';

const SettingLayout = memo(function SettingLayout() {

  return (
    <motion.div>
      <GlassContainer
        style="crystal"
        border="glow"
        rounded="3xl"
        shadow="glow"
        className="relative overflow-hidden py-5"
      >
        {/* Settings Content */}
        <div className="relative z-10 px-8 pb-12">
          {/* Language Settings */}
          <motion.div variants={itemVariants} className="mb-16">
            <SettingLanguage />
          </motion.div>
          <Divider />
          {/* Country Settings */}
          <motion.div variants={itemVariants} className="my-8">
            <SettingCountry />
          </motion.div>
        </div>
      </GlassContainer>
    </motion.div>
  );
});

export default SettingLayout;