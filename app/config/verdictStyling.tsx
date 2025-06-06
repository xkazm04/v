import { CheckCircle2, XCircle, AlertTriangle, Target } from 'lucide-react';

export const getVerdictStyling = (status: string, isDark: boolean) => {
    switch (status.toLowerCase()) {
        case 'true':
        case 'mostly true':
            return {
                icon: CheckCircle2,
                bgColor: isDark
                    ? 'from-emerald-600 to-green-700'
                    : 'from-emerald-500 to-green-600',
                textColor: 'text-white',
                badgeColor: isDark
                    ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            };
        case 'false':
        case 'mostly false':
            return {
                icon: XCircle,
                bgColor: isDark
                    ? 'from-red-600 to-rose-700'
                    : 'from-red-500 to-rose-600',
                textColor: 'text-white',
                badgeColor: isDark
                    ? 'bg-red-900/30 text-red-300 border-red-700'
                    : 'bg-red-100 text-red-800 border-red-200'
            };
        case 'mixed':
        case 'partially true':
            return {
                icon: AlertTriangle,
                bgColor: isDark
                    ? 'from-yellow-600 to-amber-700'
                    : 'from-yellow-500 to-amber-600',
                textColor: 'text-white',
                badgeColor: isDark
                    ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            };
        default:
            return {
                icon: Target,
                bgColor: isDark
                    ? 'from-blue-600 to-indigo-700'
                    : 'from-blue-500 to-indigo-600',
                textColor: 'text-white',
                badgeColor: isDark
                    ? 'bg-blue-900/30 text-blue-300 border-blue-700'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
            };
    }
};