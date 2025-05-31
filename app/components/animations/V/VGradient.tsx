import { getFillColor, getGlowColor, ResultType } from "./VGesture"

type Props = {
    result: ResultType;
    instanceId?: string; // Add unique instance ID to prevent conflicts
}

const VGradient = ({ result, instanceId = 'default' }: Props) => {
    const fillColor = getFillColor(result);
    const glowColor = getGlowColor(result);
    
    return (
        <defs>
            {/* Enhanced dot glow with multiple layers */}
            <radialGradient id={`dotGlow-${instanceId}`} cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="20%" stopColor={glowColor} stopOpacity="1" />
                <stop offset="60%" stopColor={glowColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </radialGradient>

            {/* Dynamic trail gradient */}
            <linearGradient id={`trailGradient-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={glowColor} stopOpacity="0.1" />
                <stop offset="25%" stopColor={glowColor} stopOpacity="0.6" />
                <stop offset="50%" stopColor="white" stopOpacity="0.9" />
                <stop offset="75%" stopColor={glowColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={glowColor} stopOpacity="0.1" />
            </linearGradient>

            {/* Enhanced center glow with white core */}
            <linearGradient id={`centerGlow-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor={glowColor} stopOpacity="0.3" />
                <stop offset="45%" stopColor="white" stopOpacity="0.8" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="55%" stopColor="white" stopOpacity="0.8" />
                <stop offset="70%" stopColor={glowColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Enhanced V-Shape Fill Pattern with energy waves */}
            <pattern id={`vFillPattern-${instanceId}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill={fillColor} fillOpacity="0.1" />
                {/* Energy particles with proper color references */}
                <circle cx="5" cy="5" r="0.5" fill={fillColor} fillOpacity="0.4">
                    <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="15" cy="15" r="0.5" fill={fillColor} fillOpacity="0.4">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="10" cy="8" r="0.3" fill="white" fillOpacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
                </circle>
            </pattern>

            {/* Cosmic background effect */}
            <radialGradient id={`cosmicGlow-${instanceId}`} cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor={glowColor} stopOpacity="0.05" />
                <stop offset="40%" stopColor={glowColor} stopOpacity="0.02" />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Energy field gradient */}
            <linearGradient id={`energyField-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={fillColor} stopOpacity="0.05" />
                <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                <stop offset="100%" stopColor={fillColor} stopOpacity="0.05" />
            </linearGradient>

            {/* Animated energy flow gradient */}
            <linearGradient id={`energyFlow-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent">
                    <animate attributeName="stop-color" 
                        values={`transparent;${glowColor};transparent`} 
                        dur="2s" 
                        repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor={glowColor} stopOpacity="0.8">
                    <animate attributeName="stop-opacity" 
                        values="0.2;1;0.2" 
                        dur="2s" 
                        repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="transparent">
                    <animate attributeName="stop-color" 
                        values={`transparent;${glowColor};transparent`} 
                        dur="2s" 
                        repeatCount="indefinite" 
                        begin="1s" />
                </stop>
            </linearGradient>

            {/* Filter effects for enhanced glow */}
            <filter id={`glow-${instanceId}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>

            <filter id={`innerGlow-${instanceId}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>

            {/* Advanced glow filter with color matrix */}
            <filter id={`advancedGlow-${instanceId}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feColorMatrix 
                    in="blur" 
                    type="matrix" 
                    values={`1 0 0 0 0
                             0 1 0 0 0
                             0 0 1 0 0
                             0 0 0 1 0`}
                    result="glowEffect"/>
                <feMerge>
                    <feMergeNode in="glowEffect"/>
                    <feMergeNode in="glowEffect"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
    );
};

export default VGradient;