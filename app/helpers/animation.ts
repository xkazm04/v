import { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export const overlayVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 1.05
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: 'easeInOut'
    }
  }
};

export const progressVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: (percentage: number) => ({
    scaleX: percentage / 100,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: 'easeOut'
    }
  })
};

export const badgeVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
    rotate: -180
  },
  visible: { 
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: 'backOut'
    }
  }
};