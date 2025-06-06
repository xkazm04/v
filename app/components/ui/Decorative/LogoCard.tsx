import { motion } from "framer-motion"

type Props = {
    config: {
        color: string;
        icon?: React.ComponentType<any>;
        label?: string;
    };
    currentTheme: 'light' | 'dark';
}

const LogoCard = ({config, currentTheme}: Props) => {
    return <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${config.color}${currentTheme === 'light' ? '60' : '40'}, ${config.color}${currentTheme === 'light' ? '80' : '60'})`,
                border: `2px solid ${config.color}${currentTheme === 'light' ? '90' : '80'}`,
                boxShadow: `0 8px 32px ${config.color}${currentTheme === 'light' ? '25' : '30'}`
            }}
        >
            {/* Animated background effect */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        `linear-gradient(45deg, ${config.color}${currentTheme === 'light' ? '15' : '20'}, transparent)`,
                        `linear-gradient(225deg, ${config.color}${currentTheme === 'light' ? '15' : '20'}, transparent)`,
                        `linear-gradient(45deg, ${config.color}${currentTheme === 'light' ? '15' : '20'}, transparent)`
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* V letter */}
            <span
                className="text-3xl font-black tracking-tighter relative z-10"
                style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: 'white',
                    textShadow: `0 2px 8px ${config.color}60`,
                    transform: 'perspective(50px) rotateX(10deg)'
                }}
            >
                V
            </span>
        </div>

        {/* Glow effect */}
        <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
                boxShadow: [
                    `0 0 20px ${config.color}${currentTheme === 'light' ? '30' : '40'}`,
                    `0 0 40px ${config.color}${currentTheme === 'light' ? '45' : '60'}`,
                    `0 0 20px ${config.color}${currentTheme === 'light' ? '30' : '40'}`
                ]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    </motion.div>
}

export default LogoCard;