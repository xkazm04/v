'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { supabaseProfileService } from '@/app/lib/services/supabase-profile-service';
import { Profile } from '@/app/types/profile';
import { Users, Loader2 } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { containerVariants } from '@/app/components/animations/variants/votingVariants';
import ProfilesSearch from '../../../components/profile/ProfilesSearch';
import ProfilesError from '@/app/components/profile/ProfilesError';
import ProfileItemList from '@/app/components/profile/ProfileItemList';
import ProfileItemGrid from '@/app/components/profile/ProfileItemGrid';
import ProfileFilterBar from '@/app/components/profile/ProfileFilterBar';


interface ProfileGridItemProps {
    profile: Profile;
    index: number;
    viewMode?: 'grid' | 'list';
}

const ProfileGridItem: React.FC<ProfileGridItemProps> = ({
    profile,
    index,
    viewMode = 'grid'
}) => {
    // Route to appropriate component based on view mode
    if (viewMode === 'list') {
        return <ProfileItemList profile={profile} index={index} />;
    }

    return <ProfileItemGrid profile={profile} index={index} />;
};

const AllProfilesTab: React.FC = () => {
    const { colors, isDark, vintage } = useLayoutTheme();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCountry, setSelectedCountry] = useState('all');
    const getCountryApiValue = (filterValue: string): string | undefined => {
        const countryMap: Record<string, string> = {
            'all': '', 
            'us': 'us',
            'cz': 'cz'
        };

        return filterValue === 'all' ? undefined : countryMap[filterValue];
    };


    // Fetch profiles from Supabase
    const fetchProfiles = async (refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            console.log('🔍 Fetching profiles from Supabase...');

            const fetchedProfiles = await supabaseProfileService.searchProfiles({
                type: 'person',
                limit: 24,
                sortBy: 'name',
                sortOrder: 'asc',
                search: searchTerm.trim() || undefined,
                country: getCountryApiValue(selectedCountry)
            });

            setProfiles(fetchedProfiles);
            console.log(`✅ Loaded ${fetchedProfiles.length} profiles`);

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to load profiles';
            setError(errorMsg);
            console.error('❌ Error fetching profiles:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    // Initial load
    useEffect(() => {
        fetchProfiles();
    }, [selectedCountry]);

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const gridVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.4,
                staggerChildren: 0.03
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <ProfileFilterBar
                    selectedCountry={selectedCountry}
                    onCountryChange={handleCountryChange}
                    className="mb-6"
                />
            </motion.div>

            {/* Enhanced Search and Controls */}
            <ProfilesSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                fetchProfiles={fetchProfiles}
                refreshing={refreshing}
                profiles={profiles}
            />

            {/* Loading State */}
            {loading && (
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center py-16"
                >
                    <div className="flex items-center gap-3">
                        <Loader2 className={`w-6 h-6 animate-spin ${isDark ? colors.primary : vintage.ink}`} />
                        <span
                            className="text-lg"
                            style={{
                                color: isDark ? colors.foreground : vintage.ink,
                                fontFamily: '"Crimson Text", serif'
                            }}
                        >
                            Loading profiles...
                        </span>
                    </div>
                </motion.div>
            )}

            {/* ✅ Error State */}
            {error && (
                <ProfilesError
                    fetchProfiles={() => fetchProfiles(true)}
                    error={error}
                />
            )}

            {/* ✅ Profiles Grid/List */}
            {!loading && !error && (
                <motion.div variants={itemVariants}>
                    <AnimatePresence mode="wait">
                        {profiles.length > 0 ? (
                            <motion.div
                                key={viewMode}
                                variants={gridVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className={
                                    viewMode === 'grid'
                                        ? `grid gap-6 
                       grid-cols-1 
                       sm:grid-cols-2 
                       lg:grid-cols-3 
                       xl:grid-cols-4 
                       2xl:grid-cols-4
                       `
                                        : 'space-y-4'
                                }
                            >
                                {profiles.map((profile, index) => (
                                    <ProfileGridItem
                                        key={profile.id}
                                        profile={profile}
                                        index={index}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <GlassContainer
                                    style={isDark ? 'crystal' : 'subtle'}
                                    border="visible"
                                    rounded="xl"
                                    className="p-8 max-w-md mx-auto"
                                >
                                    <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? colors.primary : vintage.ink} opacity-50`} />
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{
                                            color: isDark ? colors.foreground : vintage.ink,
                                            fontFamily: '"Playfair Display", serif'
                                        }}
                                    >
                                        No Profiles Found
                                    </h3>
                                    <p
                                        className="text-sm"
                                        style={{
                                            color: isDark ? colors.mutedForeground : vintage.faded,
                                            fontFamily: '"Crimson Text", serif'
                                        }}
                                    >
                                        {searchTerm ? `No profiles match "${searchTerm}"` : 'No profiles available at the moment'}
                                    </p>
                                </GlassContainer>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AllProfilesTab;