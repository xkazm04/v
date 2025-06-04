import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type Props = {
    condition: boolean;
}

const LogoSectionDecor = ({condition}: Props) => {
    return <AnimatePresence>
        {condition && (
            <motion.div
                className="absolute bottom-0 right-4 pointer-events-none"
                initial={{
                    opacity: 0,
                    scale: 0.8,
                    rotate: -5,
                    y: 50
                }}
                animate={{
                    opacity: 0.05,
                    scale: 1,
                    rotate: 0,
                    y: 0
                }}
                transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 0.5
                }}
                whileHover={{
                    opacity: 0.15,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                }}
            >
                <Image
                    src="/logo_large_black.png"
                    alt="NENEF Logo"
                    width={400}
                    height={400}
                    className="object-contain"
                    priority={false}
                    loading="lazy"
                />
            </motion.div>
        )}
    </AnimatePresence>
}

export default LogoSectionDecor;