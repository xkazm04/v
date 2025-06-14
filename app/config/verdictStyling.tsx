import { CheckCircle2, XCircle, AlertTriangle, Target, Shield, AlertOctagon } from 'lucide-react';

export const getVerdictStyling = (status: string, isDark: boolean) => {
    if (!status) {
        return {
            bgGradient: 'from-blue-500 to-purple-600',
            borderGlow: 'border-blue-300/50 shadow-blue-500/25',
            iconGlow: 'bg-blue-400/60',
            badgeStyle: 'bg-blue-500/20 text-blue-100 border-blue-400/30'
        };
    }

    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
        case 'true':
        case 'mostly true':
            return {
                bgGradient: 'from-emerald-500 via-green-500 to-teal-600',
                borderGlow: 'border-emerald-300/50 shadow-emerald-500/25',
                iconGlow: 'bg-emerald-400/60',
                badgeStyle: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
            };
        case 'false':
        case 'mostly false':
            return {
                bgGradient: 'from-red-500 via-rose-500 to-pink-600',
                borderGlow: 'border-red-300/50 shadow-red-500/25',
                iconGlow: 'bg-red-400/60',
                badgeStyle: 'bg-red-500/20 text-red-100 border-red-400/30'
            };
        case 'misleading':
            return {
                bgGradient: 'from-orange-500 via-red-500 to-rose-600',
                borderGlow: 'border-orange-300/50 shadow-orange-500/25',
                iconGlow: 'bg-orange-400/60',
                badgeStyle: 'bg-orange-500/20 text-orange-100 border-orange-400/30'
            };
        case 'mixed':
        case 'partially true':
        case 'partially_true':
            return {
                bgGradient: 'from-yellow-500 via-amber-500 to-orange-500',
                borderGlow: 'border-yellow-300/50 shadow-yellow-500/25',
                iconGlow: 'bg-yellow-400/60',
                badgeStyle: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30'
            };
        case 'unverifiable':
            return {
                bgGradient: 'from-slate-500 via-gray-500 to-zinc-600',
                borderGlow: 'border-slate-300/50 shadow-slate-500/25',
                iconGlow: 'bg-slate-400/60',
                badgeStyle: 'bg-slate-500/20 text-slate-100 border-slate-400/30'
            };
        default:
            return {
                bgGradient: 'from-blue-500 via-indigo-500 to-purple-600',
                borderGlow: 'border-blue-300/50 shadow-blue-500/25',
                iconGlow: 'bg-blue-400/60',
                badgeStyle: 'bg-blue-500/20 text-blue-100 border-blue-400/30'
            };
    }
};