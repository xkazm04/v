
export const tabVariants = {
  inactive: { 
    scale: 1, 
    y: 0, 
    opacity: 0.75,
    filter: 'blur(0px)'
  },
  active: { 
    scale: 1.05, 
    y: -3, 
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 25,
      mass: 0.8
    }
  },
  activeCompact: {
    scale: 1.02,
    y: -1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20
    }
  },
  tap: { 
    scale: 0.92,
    y: 1,
    transition: { duration: 0.1 }
  }
};

export const iconVariants = {
  inactive: { 
    scale: 1, 
    rotate: 0,
    filter: 'drop-shadow(0 0 0px transparent)'
  },
  active: { 
    scale: 1.15, 
    rotate: [0, -2, 2, 0],
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
    transition: {
      scale: { duration: 0.3, ease: 'easeOut' },
      rotate: { duration: 0.6, ease: 'easeInOut' },
      filter: { duration: 0.3 }
    }
  },
  activeCompact: {
    scale: 1.08,
    rotate: 0,
    filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.1))',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

export const labelVariants = {
  inactive: { 
    y: 0, 
    opacity: 0.7,
    scale: 0.95,
    fontWeight: 400
  },
  active: { 
    y: -1, 
    opacity: 1,
    scale: 1,
    fontWeight: 600,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  hidden: {
    opacity: 0,
    y: 5,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};


export const indicatorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  }
};

export const navbarVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1
    }
  }
};

export const fabVariants = {
  hidden: { 
    scale: 0, 
    opacity: 0, 
    rotate: -180,
    y: 20
  },
  visible: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
      delay: 0.2
    }
  },
  hover: {
    scale: 1.1,
    rotate: 180,
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};

export const containerVariants = {
  hidden: { y: 120, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 35,
      mass: 1,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};