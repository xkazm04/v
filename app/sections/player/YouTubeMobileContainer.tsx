import { VideoMetadata } from "@/app/types/video";
import { useCallback, useRef, useState } from "react";

type Props = {
    videos?: VideoMetadata[];
    children: React.ReactNode;
    setShowHeader: (show: boolean) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

const YouTubeMobileContainer = ({ videos, children, setShowHeader, currentIndex, setCurrentIndex }: Props) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const resetHeaderTimer = useCallback(() => {
        setShowHeader(true);
        const timer = setTimeout(() => setShowHeader(false), 3000);
        return () => clearTimeout(timer);
    }, []);
    const handleStart = useCallback((clientY: number) => {
        setIsDragging(true);
        setDragStart(clientY);
        resetHeaderTimer();
    }, [resetHeaderTimer]);

    const handleMove = useCallback((clientY: number) => {
        if (!isDragging) return;
        const diff = clientY - dragStart;
        setDragOffset(diff);
    }, [isDragging, dragStart]);

    const handleEnd = useCallback(() => {
        if (!isDragging) return;

        const threshold = 100;
        if (!videos || videos.length === 0) return;
        if (Math.abs(dragOffset) > threshold) {
            if (dragOffset < 0 && currentIndex < videos.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (dragOffset > 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }

        setIsDragging(false);
        setDragOffset(0);
        setDragStart(0);
    }, [isDragging, dragOffset, currentIndex, videos]);
    const handleTap = useCallback(() => {
        resetHeaderTimer();
    }, [resetHeaderTimer]);

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        handleStart(e.clientY);
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleMove(e.clientY);
    };

    const handleMouseUp = () => {
        handleEnd();
    };

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        handleStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        handleEnd();
    };

    const getTransform = () => {
        const baseTransform = `translateY(-${currentIndex * 100}vh)`;

        if (isDragging) {
            return `translateY(calc(-${currentIndex * 100}vh + ${dragOffset}px))`;
        }

        return baseTransform;
    };

    const containerRef = useRef<HTMLDivElement>(null);

    return <div
        ref={containerRef}
        className="flex flex-col transition-transform duration-300 ease-out touch-none"
        style={{
            transform: getTransform(),
            willChange: 'transform'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
    > {children} </div>
}
export default YouTubeMobileContainer;