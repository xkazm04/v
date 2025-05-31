export const navAnim = {
  search: {
    desktop: {
      closed: { width: 0, opacity: 0, scale: 0.8 },
      open: { width: 320, opacity: 1, scale: 1 }
    },
    mobile: {
      closed: { height: 0, opacity: 0 },
      open: { height: 'auto', opacity: 1 }
    }
  },
  mobileMenu: {
    overlay: {
      closed: { opacity: 0 },
      open: { opacity: 1 }
    },
    panel: {
      closed: { x: '-100%', opacity: 0 },
      open: { x: 0, opacity: 1 }
    }
  },
  loading: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    exit: { scaleX: 0 }
  }
};