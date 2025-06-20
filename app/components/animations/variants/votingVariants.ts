import { Variants } from "framer-motion";

export const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

export const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 10,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
                mass: 0.8
            }
        }
    };

export const progressBarVariants: Variants = {
        hidden: { 
            scaleX: 0,
            opacity: 0
        },
        visible: { 
            scaleX: 1,
            opacity: 1,
            transition: {
                type: "spring" as "spring",
                stiffness: 200,
                damping: 30,
                delay: 0.3
            }
        }
    };

export const likeButtonVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, rotate: 2 },
  tap: { scale: 0.95, rotate: -2 },
  liked: { 
    scale: [1, 1.2, 1], 
    rotate: [0, 10, 0],
    transition: { duration: 0.6, ease: "easeOut" }
  },
  votingToResults: {
    scale: [1, 1.1, 0.95],
    opacity: [1, 0.8, 0],
    y: [0, -5, -20],
    transition: { 
      duration: 0.5, 
      ease: "easeInOut",
      times: [0, 0.6, 1]
    }
  }
};

export const votingResultsContainerVariants: Variants = {
  voting: {
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1] 
    }
  },
  transitioning: {
    height: "auto",
    transition: {
      duration: 0.4,
      ease: [0.42, 0, 0.58, 1]
    }
  },
  results: {
    height: "auto", 
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1]
    }
  }
};

export const votingVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      delay: 0.7, 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -15,
    scale: 0.98,
    transition: { 
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

export const resultsVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 15,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};