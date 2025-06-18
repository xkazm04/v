export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    
    // Find last space before maxLength
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.7) { // Only use space if it's not too early
        return text.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
};

export const formatMilestoneContent = (title: string, date: string): { content: string; date: string } => {
    return {
        content: truncateText(title, 35),
        date
    };
};

export const formatEventContent = (title: string): { line1: string; line2?: string } => {
    // For events, we want concise, impactful sentences
    if (title.length <= 40) {
        return { line1: title };
    }

    const breakPoints = ['. ', '? ', '! ', ', ', ' and ', ' but ', ' or ', ' with ', ' from ', ' to '];
    let bestSplit = -1;
    let bestSplitPoint = '';
    
    for (const breakPoint of breakPoints) {
        const index = title.indexOf(breakPoint, 15); // Start looking after 15 chars
        if (index > 0 && index < 50 && (bestSplit === -1 || index < bestSplit)) {
            bestSplit = index + breakPoint.length;
            bestSplitPoint = breakPoint;
        }
    }
    
    if (bestSplit > 0) {
        return {
            line1: title.substring(0, bestSplit).trim(),
            line2: truncateText(title.substring(bestSplit).trim(), 40)
        };
    }
    
    // Fallback: split by words at midpoint
    const words = title.split(' ');
    const midpoint = Math.floor(words.length / 2);
    
    let line1 = words.slice(0, midpoint).join(' ');
    let line2 = words.slice(midpoint).join(' ');
    
    // Adjust if first line is too short or too long
    if (line1.length < 20 && words.length > 3) {
        line1 = words.slice(0, midpoint + 1).join(' ');
        line2 = words.slice(midpoint + 1).join(' ');
    }
    
    return {
        line1: truncateText(line1, 40),
        line2: line2 ? truncateText(line2, 40) : undefined
    };
};