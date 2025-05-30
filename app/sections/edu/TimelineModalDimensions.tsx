import { motion } from "framer-motion";
import { useState } from "react";
import TimelineModalDimension from "./TimelineModalDimension";

type Props = {
    event: {
        id: string;
        text_1?: string;
        text_2?: string;
        text_3?: string;
        text_4?: string;
    };
    panelColors: {
        bg: string;
        border: string;
        text: string;
        accent: string;
    }[];
}

// Dimension data configuration
export const dimensionConfig = [
    {
        key: 'text_1' as const,
        title: 'Critical Analysis',
        subtitle: 'Expert evaluation',
        icon: '🔍',
        position: { dot: 'top-2 right-2', accent: 'from-top-right' }
    },
    {
        key: 'text_2' as const,
        title: 'Economic Motivation',
        subtitle: 'Financial interests',
        icon: '💰',
        position: { dot: 'top-2 left-2', accent: 'from-top-left' }
    },
    {
        key: 'text_3' as const,
        title: 'Simple Explanation',
        subtitle: 'Accessible perspective',
        icon: '💡',
        position: { dot: 'bottom-2 right-2', accent: 'from-bottom-right' }
    },
    {
        key: 'text_4' as const,
        title: 'Psychological Analysis',
        subtitle: 'Manipulation techniques',
        icon: '🧠',
        position: { dot: 'bottom-2 left-2', accent: 'from-bottom-left' }
    }
];

const TimelineModalPerspectives = ({ event, panelColors }: Props) => {
    const [activeDimension, setActiveDimension] = useState<string | null>(null);
    
    // Filter available dimensions based on event data
    const availableDimensions = dimensionConfig.filter(
        (dimension, index) => event[dimension.key] && panelColors[index]
    );

    if (availableDimensions.length === 0) return null;

    return (
        <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >

            {/* Grid of Dimension Cards */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                animate="show"
            >
                {availableDimensions.map((dimension, index) => {
                    const text = event[dimension.key];
                    if (!text) return null;

                    return (
                        <TimelineModalDimension
                            key={dimension.key}
                            dimension={dimension}
                            panelColor={panelColors[dimensionConfig.indexOf(dimension)]}
                            index={index}
                            text={text}
                            isActive={activeDimension === dimension.key}
                            onHover={() => setActiveDimension(dimension.key)}
                            onLeave={() => setActiveDimension(null)}
                        />
                    );
                })}
            </motion.div>
        </motion.div>
    );
};

export default TimelineModalPerspectives;