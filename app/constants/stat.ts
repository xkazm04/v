export const STAT_CONFIG = [
    {
        key: 'truthCount' as const,
        label: 'Truth',
        icon: '✅',
        colors: {
            light: {
                background: '#f0fdf4',
                text: '#166534'
            },
            dark: {
                background: 'rgba(34, 197, 94, 0.1)',
                text: '#22c55e'
            }
        }
    },
    {
        key: 'neutralCount' as const,
        label: 'Neutral',
        icon: '⚖️',
        colors: {
            light: {
                background: '#fffbeb',
                text: '#92400e'
            },
            dark: {
                background: 'rgba(245, 158, 11, 0.1)',
                text: '#f59e0b'
            }
        }
    },
    {
        key: 'lieCount' as const,
        label: 'False',
        icon: '❌',
        colors: {
            light: {
                background: '#fef2f2',
                text: '#991b1b'
            },
            dark: {
                background: 'rgba(239, 68, 68, 0.1)',
                text: '#ef4444'
            }
        }
    },
    {
        key: 'avgConfidence' as const,
        label: 'Confidence',
        icon: '📊',
        suffix: '%',
        colors: {
            light: {
                background: '#f8fafc',
                text: '#475569'
            },
            dark: {
                background: 'rgba(148, 163, 184, 0.1)',
                text: '#94a3b8'
            }
        }
    }
] as const;