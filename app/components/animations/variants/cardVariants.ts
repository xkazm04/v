export const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

export const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const playButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};