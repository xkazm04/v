import { motion } from "framer-motion";

type Props = {
    score: number;
}

const DashRelScore = ({score}: Props) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981'; // green
        if (score >= 60) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };


    return <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--border))"
                strokeWidth="8"
                fill="none"
            />
            <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke={getScoreColor(score)}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{score}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
        </div>
    </div>
}

export default DashRelScore;