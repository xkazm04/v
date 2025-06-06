
export const tabVariants = {
  inactive: { 
    scale: 1, 
    y: 0, 
    opacity: 0.6 
  },
  active: { 
    scale: 1.1, 
    y: -2, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20
    }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
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