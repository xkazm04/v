import { itemVariants } from "@/app/components/animations/variants/votingVariants";
import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { Profile } from "@/app/types/profile";
import { motion } from "framer-motion";
import { Grid3X3, List, RefreshCcw, Search, Users } from "lucide-react";
import { useEffect } from "react";

type Props = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    fetchProfiles: (refresh?: boolean) => void;
    refreshing: boolean;
    profiles: Profile[];
}

const ProfilesSearch = ({ searchTerm, setSearchTerm, viewMode, setViewMode, fetchProfiles, refreshing, profiles }: Props) => {
    const handleClearSearch = () => {
        setSearchTerm('');
        fetchProfiles();
    };

    // Refresh handler
    const handleRefresh = () => {
        fetchProfiles(true);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                fetchProfiles();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const { colors, isDark, vintage } = useLayoutTheme();
    return <>
        <motion.div variants={itemVariants}>
            <GlassContainer
                style={isDark ? 'crystal' : 'subtle'}
                border={isDark ? 'glow' : 'visible'}
                rounded="xl"
                shadow={isDark ? 'glow' : 'lg'}
                className="p-6"
            >
                {/* Vintage paper texture for light mode */}
                {!isDark && (
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
                        style={{
                            backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                  radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
                `,
                            backgroundSize: '40px 40px, 25px 25px'
                        }}
                    />
                )}

                <div className="flex flex-row gap-4 items-center justify-between relative z-10">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : vintage.faded
                            }`} />

                        <motion.input
                            type="text"
                            placeholder="Search profiles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            style={{
                                background: isDark
                                    ? 'rgba(255,255,255,0.05)'
                                    : `linear-gradient(135deg, ${vintage.paper}80, ${vintage.highlight}40)`,
                                color: isDark ? colors.foreground : vintage.ink,
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : vintage.aged,
                                fontSize: '16px',
                                fontFamily: '"Crimson Text", serif'
                            }}
                            whileFocus={{ scale: 1.02 }}
                        />

                        {searchTerm && (
                            <motion.button
                                onClick={handleClearSearch}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'text-gray-400 hover:text-white' : `${vintage.faded} hover:${vintage.ink}`
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ✕
                            </motion.button>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 p-1 rounded-lg" style={{
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(184, 134, 11, 0.1)',
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${vintage.aged}`
                        }}>
                            <motion.button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                                    ? (isDark ? 'bg-purple-600/50 text-purple-300' : 'bg-amber-200 text-amber-800')
                                    : (isDark ? 'text-gray-400 hover:text-white' : `${vintage.faded} hover:${vintage.ink}`)
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list'
                                    ? (isDark ? 'bg-purple-600/50 text-purple-300' : 'bg-amber-200 text-amber-800')
                                    : (isDark ? 'text-gray-400 hover:text-white' : `${vintage.faded} hover:${vintage.ink}`)
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <List className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-2">
                            <Users className={`w-5 h-5 ${isDark ? colors.primary : vintage.ink}`} />
                            <span
                                className="font-semibold"
                                style={{
                                    color: isDark ? colors.foreground : vintage.ink,
                                    fontFamily: '"Playfair Display", serif'
                                }}
                            >
                                {profiles.length} Profiles
                            </span>
                        </div>

                        {/* Refresh Button */}
                        <motion.button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className={`p-2 rounded-lg transition-all duration-300 ${isDark
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </div>
                </div>
            </GlassContainer>
        </motion.div>
    </>
}

export default ProfilesSearch;