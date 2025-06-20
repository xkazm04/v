import { VideoWithTimestamps } from "@/app/types/video_api";
import { useCallback, useRef, useState } from "react";
import { motion, PanInfo, useAnimation, Variants } from "framer-motion";

type Props = {
    videos?: VideoWithTimestamps[];
    children: React.ReactNode;
    setShowHeader: (show: boolean) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

interface SwipeState {
    isDragging: boolean;
    direction: 'vertical' | 'horizontal' | null;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isInteractive: boolean; // Whether we're in an interactive zone
    isVotingArea: boolean; // Whether we're in a voting area
}

const YouTubeMobileContainer = ({ 
    videos, 
    children, 
    setShowHeader, 
    currentIndex, 
    setCurrentIndex 
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    
    const [swipeState, setSwipeState] = useState<SwipeState>({
        isDragging: false,
        direction: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isInteractive: false,
        isVotingArea: false
    });

    // Configuration
    const SWIPE_THRESHOLD = 80;
    const SWIPE_VELOCITY_THRESHOLD = 300;
    const INTERACTIVE_ZONE_WIDTH = 0.3; // 30% of screen width for interactive zones
    const DIRECTION_THRESHOLD = 15; // Pixels to determine swipe direction
    const VOTING_ZONE_HEIGHT = 0.3; // 30% of screen height from top for voting areas

    // Reset header timer utility
    const resetHeaderTimer = useCallback(() => {
        setShowHeader(true);
        const timer = setTimeout(() => setShowHeader(false), 4000);
        return () => clearTimeout(timer);
    }, [setShowHeader]);

    // Check if touch is in interactive zone (left/right edges or voting area)
    const isInInteractiveZone = useCallback((x: number, y: number) => {
        if (!containerRef.current) return false;
        
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        const width = rect.width;
        const height = rect.height;
        
        // Left/right edge zones for navigation
        const leftZone = relativeX < width * INTERACTIVE_ZONE_WIDTH;
        const rightZone = relativeX > width * (1 - INTERACTIVE_ZONE_WIDTH);
        
        // Bottom area for voting (last 40% of screen height)
        const votingZone = relativeY > height * 0.6;
        
        return leftZone || rightZone || votingZone;
    }, []);

    // Check if touch is specifically in voting area (where headers with voting buttons appear)
    const isInVotingArea = useCallback((x: number, y: number) => {
        if (!containerRef.current) return false;
        
        const rect = containerRef.current.getBoundingClientRect();
        const relativeY = y - rect.top;
        const height = rect.height;
        
        // Top area where voting headers appear (first 30% of screen)
        return relativeY < height * VOTING_ZONE_HEIGHT;
    }, []);

    // Check if target element is a voting button or its child
    const isVotingElement = useCallback((element: Element | null): boolean => {
        if (!element) return false;
        
        // Check if element or any parent has voting-related classes or data attributes
        let current = element;
        while (current && current !== document.body) {
            const classList = current.classList;
            const dataAttributes = current.getAttribute('data-voting');
            
            // Check for voting-related classes or attributes
            if (
                classList.contains('voting-button') ||
                classList.contains('vote-agree') ||
                classList.contains('vote-disagree') ||
                dataAttributes === 'true' ||
                current.tagName === 'BUTTON' && current.closest('[class*="voting"]')
            ) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }, []);

    // Enhanced pan handlers with voting area protection
    const handlePanStart = useCallback((event: any, info: PanInfo) => {
        const { point } = info;
        const target = event.target as Element;
        
        // Check if this is a voting element - if so, don't handle swipes
        if (isVotingElement(target)) {
            return;
        }
        
        const isInteractive = isInInteractiveZone(point.x, point.y);
        const isVotingArea = isInVotingArea(point.x, point.y);
        
        setSwipeState({
            isDragging: true,
            direction: null,
            startX: point.x,
            startY: point.y,
            currentX: point.x,
            currentY: point.y,
            isInteractive,
            isVotingArea
        });

        resetHeaderTimer();
    }, [isInInteractiveZone, isInVotingArea, isVotingElement, resetHeaderTimer]);

    const handlePan = useCallback((event: any, info: PanInfo) => {
        const { point, delta } = info;
        
        setSwipeState(prev => {
            if (!prev.isDragging || prev.isVotingArea) return prev;
            
            const deltaX = Math.abs(point.x - prev.startX);
            const deltaY = Math.abs(point.y - prev.startY);
            
            // Determine swipe direction if not already set
            let direction = prev.direction;
            if (!direction && (deltaX > DIRECTION_THRESHOLD || deltaY > DIRECTION_THRESHOLD)) {
                direction = deltaX > deltaY ? 'horizontal' : 'vertical';
            }
            
            return {
                ...prev,
                currentX: point.x,
                currentY: point.y,
                direction
            };
        });
    }, []);

    const handlePanEnd = useCallback((event: any, info: PanInfo) => {
        const { offset, velocity } = info;
        
        setSwipeState(prev => {
            if (!prev.isDragging || prev.isVotingArea) {
                return {
                    isDragging: false,
                    direction: null,
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    isInteractive: false,
                    isVotingArea: false
                };
            }
            
            const { direction, isInteractive } = prev;
            
            // Handle horizontal swipes in interactive zones (Tinder-like)
            if (direction === 'horizontal' && isInteractive) {
                const shouldSwipeLeft = offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD;
                const shouldSwipeRight = offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD;
                
                if (shouldSwipeLeft || shouldSwipeRight) {
                    // Trigger swipe animation (you can add visual feedback here)
                    console.log(`Horizontal swipe: ${shouldSwipeLeft ? 'left' : 'right'}`);
                    resetHeaderTimer();
                }
            }
            
            // Handle vertical swipes for video navigation
            if (direction === 'vertical' && !isInteractive && videos) {
                const shouldSwipeUp = offset.y < -SWIPE_THRESHOLD || velocity.y < -SWIPE_VELOCITY_THRESHOLD;
                const shouldSwipeDown = offset.y > SWIPE_THRESHOLD || velocity.y > SWIPE_VELOCITY_THRESHOLD;
                
                if (shouldSwipeUp && currentIndex < videos.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else if (shouldSwipeDown && currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                }
            }
            
            return {
                isDragging: false,
                direction: null,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                isInteractive: false,
                isVotingArea: false
            };
        });
    }, [videos, currentIndex, setCurrentIndex, resetHeaderTimer]);

    // Handle tap for header toggle - avoid interfering with voting buttons
    const handleTap = useCallback((event: any) => {
        const target = event.target as Element;
        
        // Don't handle tap if it's on a voting element
        if (isVotingElement(target)) {
            return;
        }
        
        resetHeaderTimer();
    }, [resetHeaderTimer, isVotingElement]);

    // Animation variants for smooth transitions
    const containerVariants = {
        initial: { y: 0 },
        animate: { 
            y: -currentIndex * window.innerHeight,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <motion.div
                ref={containerRef}
                className="flex flex-col"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                onPanStart={handlePanStart}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                onTap={handleTap}
                style={{
                    willChange: 'transform',
                    height: `${(videos?.length || 1) * 100}vh`
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default YouTubeMobileContainer;