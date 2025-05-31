import { getFillColor, getGlowColor, ResultType } from "./VGesture"

type Props = {
    result: ResultType
}

const VGradient = ({result}: Props) => {
    return <defs>
        {/* Enhanced dot glow with multiple layers */}
        <radialGradient id="dotGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="20%" stopColor={getGlowColor(result)} stopOpacity="1" />
            <stop offset="60%" stopColor={getGlowColor(result)} stopOpacity="0.6" />
            <stop offset="100%" stopColor={getGlowColor(result)} stopOpacity="0" />
        </radialGradient>

        {/* Dynamic trail gradient */}
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getGlowColor(result)} stopOpacity="0.1" />
            <stop offset="25%" stopColor={getGlowColor(result)} stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.9" />
            <stop offset="75%" stopColor={getGlowColor(result)} stopOpacity="0.6" />
            <stop offset="100%" stopColor={getGlowColor(result)} stopOpacity="0.1" />
        </linearGradient>

        {/* Enhanced center glow with white core */}
        <linearGradient id="centerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor={getGlowColor(result)} stopOpacity="0.3" />
            <stop offset="45%" stopColor="white" stopOpacity="0.8" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="55%" stopColor="white" stopOpacity="0.8" />
            <stop offset="70%" stopColor={getGlowColor(result)} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Enhanced V-Shape Fill Pattern with energy waves */}
        <pattern id="vFillPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={getFillColor(result)} fillOpacity="0.1" />
            {/* Energy particles */}
            <circle cx="5" cy="5" r="0.5" fill={getFillColor(result)} fillOpacity="0.4">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="15" cy="15" r="0.5" fill={getFillColor(result)} fillOpacity="0.4">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="10" cy="8" r="0.3" fill="white" fillOpacity="0.6">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
        </pattern>

        {/* Cosmic background effect */}
        <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor={getGlowColor(result)} stopOpacity="0.05" />
            <stop offset="40%" stopColor={getGlowColor(result)} stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Energy field gradient */}
        <linearGradient id="energyField" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getFillColor(result)} stopOpacity="0.05" />
            <stop offset="50%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor={getFillColor(result)} stopOpacity="0.05" />
        </linearGradient>

        {/* Filter effects for enhanced glow */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>

        <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
}

export default VGradient