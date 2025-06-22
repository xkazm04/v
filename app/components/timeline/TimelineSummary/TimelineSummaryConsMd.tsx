import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

type Props = {
    section: {
        title: string;
        content: string;
    };
    sectionColor: string;
}

const TimelineSummaryConsMd = ({ section, sectionColor }: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();
    return <div className="relative px-4 pb-4 z-10">
        <div
            className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''
                }`}
            style={{
                '--tw-prose-body': isDark ? colors.foreground : vintage.ink,
                '--tw-prose-headings': sectionColor,
                '--tw-prose-bold': sectionColor,
                '--tw-prose-bullets': sectionColor,
                '--tw-prose-counters': sectionColor,
            } as React.CSSProperties}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 style={{
                            color: sectionColor,
                            marginBottom: '1rem',
                            fontSize: '1.25rem'
                        }}>
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 style={{
                            color: sectionColor,
                            marginBottom: '0.75rem',
                            fontSize: '1.1rem'
                        }}>
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 style={{
                            color: sectionColor,
                            marginBottom: '0.5rem',
                            fontSize: '1rem'
                        }}>
                            {children}
                        </h3>
                    ),
                    strong: ({ children }) => (
                        <strong style={{
                            color: sectionColor,
                            fontWeight: '700',
                            backgroundColor: `${sectionColor}10`,
                            padding: '0.125rem 0.25rem',
                            borderRadius: '0.25rem'
                        }}>
                            {children}
                        </strong>
                    ),
                    li: ({ children }) => (
                        <li style={{
                            marginBottom: '0.5rem',
                            color: isDark ? colors.foreground : vintage.ink,
                            lineHeight: '1.6'
                        }}>
                            <div className="flex items-start gap-2">
                                <div
                                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                    style={{ backgroundColor: sectionColor }}
                                />
                                <span>{children}</span>
                            </div>
                        </li>
                    ),
                    ul: ({ children }) => (
                        <ul style={{
                            listStyle: 'none',
                            paddingLeft: '0',
                            marginBottom: '1rem'
                        }}>
                            {children}
                        </ul>
                    ),
                    p: ({ children }) => (
                        <p style={{
                            marginBottom: '0.75rem',
                            lineHeight: '1.7',
                            color: isDark ? colors.foreground : vintage.ink
                        }}>
                            {children}
                        </p>
                    )
                }}
            >
                {section.content}
            </ReactMarkdown>
        </div>

        {/* Visual Enhancement: Stats highlighting */}
        {section.content.includes('$') || section.content.includes('€') || section.content.includes('billion') || section.content.includes('million') ? (
            <motion.div
                className="mt-4 p-3 rounded-lg"
                style={{
                    backgroundColor: `${sectionColor}08`,
                    border: `1px solid ${sectionColor}20`
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-2">
                    <DollarSign
                        className="w-4 h-4"
                        style={{ color: sectionColor }}
                    />
                    <span
                        className="text-xs font-medium"
                        style={{ color: sectionColor }}
                    >
                        Financial Impact Section
                    </span>
                </div>
            </motion.div>
        ) : null}
    </div>
}

export default TimelineSummaryConsMd