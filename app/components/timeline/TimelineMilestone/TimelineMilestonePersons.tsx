
import { motion, Variants } from 'framer-motion';
import { Users, Crown, User, Shield, Briefcase, Gavel } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { KeyPerson } from '@/app/types/timeline';

interface TimelineMilestonePersonsProps {
  persons: KeyPerson[];
  isMobile: boolean;
  colors: any;
}

// Helper function to get appropriate icon based on role
const getRoleIcon = (role: string, index: number) => {
  const roleKey = role.toLowerCase();
  
  if (roleKey.includes('president') || roleKey.includes('prime minister')) {
    return Crown;
  }
  if (roleKey.includes('secretary') || roleKey.includes('minister')) {
    return Briefcase;
  }
  if (roleKey.includes('administrator') || roleKey.includes('general')) {
    return Shield;
  }
  if (roleKey.includes('judge') || roleKey.includes('justice')) {
    return Gavel;
  }
  
  // Default: Crown for first person, User for others
  return index === 0 ? Crown : User;
};

// Helper function to get role priority for styling
const getRolePriority = (role: string): 'high' | 'medium' | 'low' => {
  const roleKey = role.toLowerCase();
  
  if (roleKey.includes('president') || roleKey.includes('prime minister')) {
    return 'high';
  }
  if (roleKey.includes('secretary') || roleKey.includes('minister') || roleKey.includes('administrator')) {
    return 'medium';
  }
  
  return 'low';
};

export default function TimelineMilestonePersons({
  persons,
  isMobile,
  colors
}: TimelineMilestonePersonsProps) {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const personVariants: Variants = {
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
        overlay={false}
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
              boxShadow:  `0 0 8px ${colors.primary}20`}}
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
              : persons.length <= 2
                ? 'grid-cols-2' 
                : persons.length <= 3 
                  ? 'grid-cols-3' 
                  : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
          variants={containerVariants}
        >
          {persons.map((person, personIndex) => {
            const IconComponent = getRoleIcon(person.role, personIndex);
            const priority = getRolePriority(person.role);
            
            return (
              <motion.div
                key={`${person.name}-${personIndex}`}
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
                  className={`${isMobile ? 'p-3' : 'p-4'} h-full transition-all duration-300`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Header with Icon and Priority */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        className={`p-2 rounded-full flex-shrink-0 ${
                          isMobile ? 'p-1.5' : 'p-2'
                        }`}
                        style={{ 
                          backgroundColor: priority === 'high' 
                            ? colors.primary + '15'
                            : priority === 'medium'
                              ? colors.primary + '10'
                              : colors.primary + '08',
                          border: `1px solid ${colors.primary}${priority === 'high' ? '30' : '20'}`
                        }}
                        animate={{
                          backgroundColor: [
                            colors.primary + (priority === 'high' ? '15' : '10'),
                            colors.primary + (priority === 'high' ? '20' : '15'),
                            colors.primary + (priority === 'high' ? '15' : '10')
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: personIndex * 0.5
                        }}
                      >
                        <IconComponent 
                          className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                          style={{ color: colors.primary }}
                        />
                      </motion.div>

                      {/* Priority Indicator */}
                      <motion.div
                        className={`w-2 h-2 rounded-full flex-shrink-0`}
                        style={{ 
                          backgroundColor: priority === 'high' 
                            ? colors.primary
                            : priority === 'medium'
                              ? colors.primary + '80'
                              : colors.primary + '60'
                        }}
                        animate={{
                          scale: [1, priority === 'high' ? 1.4 : 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: priority === 'high' ? 2 : 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: personIndex * 0.2
                        }}
                      />
                    </div>

                    {/* Person Info */}
                    <div className="space-y-1">
                      <motion.p 
                        className={`font-semibold leading-tight ${
                          isMobile ? 'text-sm' : 'text-base'
                        }`}
                        style={{ color: colors.foreground }}
                        animate={{
                          color: colors.foreground
                        }}
                        transition={{ duration: 0.3 }}
                        title={person.name} // Tooltip for long names
                      >
                        {person.name}
                      </motion.p>
                      
                      <motion.p 
                        className={`opacity-70 leading-tight ${isMobile ? 'text-xs' : 'text-sm'}`}
                        style={{ color: colors.foreground }}
                        title={person.role} // Tooltip for long roles
                      >
                        {person.role}
                      </motion.p>
                    </div>

                    {/* Role Priority Badge */}
                    {priority === 'high' && (
                      <motion.div
                        className={`self-start px-2 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-xs'}`}
                        style={{ 
                          backgroundColor: colors.primary + '15',
                          color: colors.primary,
                          border: `1px solid ${colors.primary}30`
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: personIndex * 0.1 + 0.3 }}
                      >
                        <span className="font-medium">Primary</span>
                      </motion.div>
                    )}
                  </div>
                </GlassContainer>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Footer */}
        {persons.length > 3 && (
          <motion.div
            className={`mt-4 pt-4 border-t flex items-center justify-center gap-2 ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}
            style={{ 
              borderColor: colors.border + '30',
              color: colors.foreground + '70'
            }}
            variants={personVariants}
          >
            <Users className="w-3 h-3" style={{ color: colors.primary }} />
            <span>
              {persons.filter(p => getRolePriority(p.role) === 'high').length} primary • {' '}
              {persons.filter(p => getRolePriority(p.role) === 'medium').length} secondary • {' '}
              {persons.filter(p => getRolePriority(p.role) === 'low').length} supporting
            </span>
          </motion.div>
        )}
      </GlassContainer>
    </motion.div>
  );
}