export const scrollDown = () => {
  const currentY = window.scrollY;
  const targetElement = document.createElement('div');
  targetElement.style.position = 'absolute';
  targetElement.style.top = `${currentY + 100}px`;
  targetElement.style.height = '1px';
  document.body.appendChild(targetElement);
  
  // Use CSS smooth scroll
  targetElement.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(targetElement);
  }, 1000);
};