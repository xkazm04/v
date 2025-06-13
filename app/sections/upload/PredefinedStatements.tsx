'use client';

import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Quote, Calendar, MapPin, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generatePositions } from '@/app/constants/positions';

interface PredefinedStatement {
  id: string;
  speaker: string;
  quote: string;
  context: string;
  date: string;
  category: 'climate' | 'politics' | 'historical';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedVerdict: 'TRUE' | 'FALSE' | 'MISLEADING';
}

const predefinedStatements: PredefinedStatement[] = [
  {
    id: 'biden-mandela',
    speaker: 'Joe Biden',
    quote: 'I was arrested trying to see Nelson Mandela.',
    context: 'Campaign event in South Carolina',
    date: '2020-02-15',
    category: 'politics',
    difficulty: 'easy',
    expectedVerdict: 'FALSE'
  },
  {
    id: 'nixon-profit',
    speaker: 'Richard Nixon',
    quote: 'I have never profited from public service.',
    context: 'Defending his financial dealings during the Watergate investigation.',
    date: '1973-11-20',
    category: 'historical',
    difficulty: 'hard',
    expectedVerdict: 'FALSE'
  },
  {
    id: 'trump-crowd',
    speaker: 'Donald Trump',
    quote: 'My inauguration had the largest audience ever.',
    context: 'Press briefing about crowd sizes',
    date: '2017-01-21',
    category: 'politics',
    difficulty: 'easy',
    expectedVerdict: 'FALSE'
  },
];

interface PredefinedStatementsProps {
  onSelect: (statement: PredefinedStatement) => void;
  selectedStatement: string;
}


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

const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    rotateX: -180,
    y: 100
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  selected: {
    scale: 1.15,
    z: 200,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 300
    }
  }
};

const getCategoryStyle = (category: string) => {
  const styles = {
    climate: {
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'rgba(16, 185, 129, 0.4)',
      icon: '🌍',
      bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10'
    },
    politics: {
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'rgba(59, 130, 246, 0.4)',
      icon: '🏛️',
      bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10'
    },
    historical: {
      gradient: 'from-purple-500 to-pink-600',
      shadow: 'rgba(168, 85, 247, 0.4)',
      icon: '📜',
      bg: 'bg-gradient-to-br from-purple-500/10 to-pink-600/10'
    }
  };
  return styles[category as keyof typeof styles] || styles.politics;
};


export default function PredefinedStatements({ onSelect, selectedStatement }: PredefinedStatementsProps) {
  const { isDark } = useLayoutTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [positions] = useState(() => generatePositions(predefinedStatements.length));
  
  // Floating animation
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.02);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getFloatingTransform = (index: number) => {
    const pos = positions[index];
    const floatY = Math.sin(time + pos.floatOffset) * 8; // Reduced floating range
    const floatX = Math.cos(time * 0.3 + pos.floatOffset) * 4;
    return `translate(${floatX}px, ${floatY}px)`;
  };

  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full h-full"
      >
        {predefinedStatements.map((statement, index) => {
          const isSelected = selectedStatement === statement.quote;
          const isHovered = hoveredCard === statement.id;
          const categoryStyle = getCategoryStyle(statement.category);
          const pos = positions[index];
          
          return (
            <motion.div
              key={statement.id}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`,
                zIndex: isSelected ? 50 : isHovered ? 40 : index
              }}
              animate={{
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale}) ${getFloatingTransform(index)}`
              }}
              transition={{
                transform: {
                  duration: 0.1,
                  ease: "linear"
                }
              }}
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                animate={isSelected ? "selected" : "visible"}
                onHoverStart={() => setHoveredCard(statement.id)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => onSelect(statement)}
                className="cursor-pointer"
              >
                <div
                  className={`
                    relative w-80 rounded-2xl overflow-hidden
                    backdrop-blur-md transition-all duration-300
                    ${isDark ? 'bg-gray-900/80' : 'bg-white/80'}
                    ${isSelected ? 'ring-4 ring-offset-2' : 'ring-1'}
                    ${isSelected ? `ring-offset-${isDark ? 'gray-900' : 'white'}` : ''}
                  `}
                  style={{
                    boxShadow: isSelected 
                      ? `0 20px 40px ${categoryStyle.shadow}, 0 0 60px ${categoryStyle.shadow}`
                      : isHovered
                      ? `0 15px 30px ${categoryStyle.shadow}, 0 0 40px ${categoryStyle.shadow}`
                      : `0 10px 20px rgba(0,0,0,0.1)`,
                    borderColor: isSelected || isHovered 
                      ? categoryStyle.shadow 
                      : 'transparent'
                  }}
                >
                  {/* Category banner */}
                  <div className={`h-0.5 bg-gradient-to-r ${categoryStyle.gradient}`} />
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Quote */}
                    <div className="relative mb-4">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 opacity-10" />
                      <p className={`text-sm font-medium leading-relaxed pl-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {statement.quote}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <User className={`h-3 w-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {statement.speaker}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-xs">
                        <MapPin className={`h-3 w-3 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                          {statement.context}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className={`h-3 w-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {new Date(statement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}