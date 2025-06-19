import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion"
import Link from "next/link";
import SettingsIcon from "../icons/setting";
import { useState } from "react";

const SideSettingButton = () => {
    const { isDark } = useLayoutTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center py-10"
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className=""
            >
                <Link href="/settings">
                    <motion.button
                        className="relative flex items-center justify-center rounded-2xl transition-all duration-300 group overflow-hidden"
                    >
                        {isDark && (
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )}

                        {/* Settings Icon - only rotates on hover */}
                        <motion.div
                            className="relative z-10"
                            animate={isHovered ? {
                                rotate: [0, 180, 360]
                            } : {
                                rotate: 0
                            }}
                            transition={isHovered ? {
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "linear"
                            } : {
                                duration: 0.3
                            }}
                        >
                            <SettingsIcon 
                                width={50} 
                                color={isDark ? 'white' : 'black'} 
                            />
                        </motion.div>
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    );
};

export default SideSettingButton;