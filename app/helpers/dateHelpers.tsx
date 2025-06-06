export const formatSafeDate = (dateString: string): {
  absolute: string;
  relative: string;
  isValid: boolean
} => {
  if (!dateString) return { absolute: 'No date', relative: 'Unknown', isValid: false };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { absolute: 'Invalid date', relative: 'Unknown', isValid: false };
    }

    const now = Date.now();
    const timeDiff = now - date.getTime();

    // Relative time calculation
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(timeDiff / 3600000);
    const days = Math.floor(timeDiff / 86400000);

    let relative = '';
    if (minutes < 1) relative = 'Just now';
    else if (minutes < 60) relative = `${minutes}m ago`;
    else if (hours < 24) relative = `${hours}h ago`;
    else if (days < 7) relative = `${days}d ago`;
    else relative = date.toLocaleDateString();

    return {
      absolute: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      }),
      relative,
      isValid: true
    };
  } catch (error) {
    return { absolute: 'Invalid date', relative: 'Unknown', isValid: false };
  }
};