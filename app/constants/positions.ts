export const generatePositions = (count: number) => {
  const positions = [];
  const minDistance = 25; // Minimum distance between cards (in percentage)
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let newPos = { x: 0, y: 0 };
    
    // Try to find a position that doesn't overlap with existing cards
    while (!validPosition && attempts < 50) {
      newPos = {
        x: 15 + Math.random() * 70, // Keep cards away from edges (15% to 85%)
        y: 15 + Math.random() * 70  // Use full height range (15% to 85%)
      };
      
      // Check distance from all existing positions
      validPosition = positions.every(pos => {
        const distance = Math.sqrt(
          Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2)
        );
        return distance >= minDistance;
      });
      
      attempts++;
    }
    
    // If we couldn't find a non-overlapping position, use a fallback grid-based approach
    if (!validPosition) {
      const cols = Math.ceil(Math.sqrt(count));
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      newPos = {
        x: 20 + (col * 60 / (cols - 1)) + (Math.random() - 0.5) * 10,
        y: 20 + (row * 60 / Math.ceil(count / cols - 1)) + (Math.random() - 0.5) * 10
      };
    }
    
    positions.push({
      x: newPos.x,
      y: newPos.y,
      rotation: (Math.random() - 0.5) * 20, // Increased rotation range
      scale: 0.8 + Math.random() * 0.4,     // Varied scale
      floatOffset: Math.random() * Math.PI * 2
    });
  }
  
  return positions;
};