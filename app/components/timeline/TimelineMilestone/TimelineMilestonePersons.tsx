'use client';
import { motion } from 'framer-motion';
import { Users, Crown, User } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

interface TimelineMilestonePersonsProps {
  persons: string[];
  isActive: boolean;
  isMobile: boolean;
  colors: any;
}

export default function TimelineMilestonePersons({
  persons,
  isActive,
  isMobile,
  colors
}: TimelineMilestonePersonsProps) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const personVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className={`max-w-4xl mx-auto ${isMobile ? 'px-4' : 'px-0'}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <GlassContainer
        style="subtle"
        border="visible"
        shadow="md"
        rounded="xl"
        className={isMobile ? 'p-4' : 'p-6'}
        overlay={isActive}
        overlayOpacity={0.05}
      >
        {/* Header */}
        <motion.div 
          className="flex items-center gap-3 mb-6"
          variants={personVariants}
        >
          <motion.div
            className={`p-2 rounded-lg ${isMobile ? 'p-1.5' : 'p-2'}`}
            style={{ backgroundColor: colors.primary + '15' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              boxShadow: isActive 
                ? [`0 0 15px ${colors.primary}40`, `0 0 25px ${colors.primary}60`, `0 0 15px ${colors.primary}40`]
                : `0 0 8px ${colors.primary}20`
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Users 
              className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} 
              style={{ color: colors.primary }} 
            />
          </motion.div>
          
          <div>
            <h3 
              className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}
              style={{ color: colors.primary }}
            >
              Key Figures
            </h3>
            <p 
              className={`opacity-70 ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ color: colors.foreground }}
            >
              {persons.length} influential {persons.length === 1 ? 'person' : 'people'}
            </p>
          </div>
        </motion.div>

        {/* Persons Grid */}
        <motion.div 
          className={`grid gap-3 ${
            isMobile 
              ? 'grid-cols-1' 
              : persons.length <= 3 
                ? 'grid-cols-3' 
                : 'grid-cols-2 lg:grid-cols-3'
          }`}
          variants={containerVariants}
        >
          {persons.map((person, personIndex) => (
            <motion.div
              key={person}
              variants={personVariants}
              whileHover={{ 
                scale: 1.02,
                y: -2
              }}
              className="group"
            >
              <GlassContainer
                style="frosted"
                border="subtle"
                rounded="lg"
                className={`${isMobile ? 'p-3' : 'p-4'} h-full`}
              >
                <div className="flex items-center gap-3">
                  {/* Person Icon */}
                  <motion.div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      isMobile ? 'p-1.5' : 'p-2'
                    }`}
                    style={{ 
                      backgroundColor: colors.primary + '10',
                      border: `1px solid ${colors.primary}20`
                    }}
                    animate={{
                      backgroundColor: [
                        colors.primary + '10',
                        colors.primary + '15',
                        colors.primary + '10'
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: personIndex * 0.5
                    }}
                  >
                    {personIndex === 0 ? (
                      <Crown 
                        className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                        style={{ color: colors.primary }}
                      />
                    ) : (
                      <User 
                        className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                        style={{ color: colors.primary }}
                      />
                    )}
                  </motion.div>

                  {/* Person Info */}
                  <div className="flex-1 min-w-0">
                    <motion.p 
                      className={`font-semibold truncate ${
                        isMobile ? 'text-sm' : 'text-base'
                      }`}
                      style={{ color: colors.foreground }}
                      animate={{
                        color: isActive ? colors.primary : colors.foreground
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {person}
                    </motion.p>
                    
                    <motion.p 
                      className={`opacity-60 ${isMobile ? 'text-xs' : 'text-sm'}`}
                      style={{ color: colors.foreground }}
                    >
                      {personIndex === 0 ? 'Primary Figure' : 'Key Player'}
                    </motion.p>
                  </div>

                  {/* Priority Indicator */}
                  <motion.div
                    className={`w-2 h-2 rounded-full flex-shrink-0`}
                    style={{ 
                      backgroundColor: personIndex === 0 ? colors.primary : colors.primary + '60'
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2 + personIndex * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: personIndex * 0.2
                    }}
                  />
                </div>
              </GlassContainer>
            </motion.div>
          ))}
        </motion.div>
      </GlassContainer>
    </motion.div>
  );
}