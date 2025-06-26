'use client';

import { motion } from 'framer-motion';
import { Video, PenToolIcon, TwitterIcon, Clock, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import UploadLayout from "../sections/upload/uploadQuote/UploadLayout";
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import Image from 'next/image';
import UploadVideo from '../sections/upload/uploadYouTube/UploadVideo';
import TwitterLayout from '../sections/upload/uploadTwitter/TwitterLayout';
import { containerVariants } from '../components/animations/variants/feedVariants';
import { itemVariants } from '../components/animations/variants/votingVariants';
import VintageBackButton from '../components/ui/Buttons/VintageBackButton';

const Page = () => {
    const { isDark, colors } = useLayoutTheme();

    return (
        <motion.div
            className="min-h-screen bg-background"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                background: isDark
                    ? `linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.1) 0%,
                  rgba(147, 91, 104, 0.1) 100%
                )`
                    : `linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.05) 0%,
                  rgba(147, 51, 234, 0.05) 100%
                )`,
            }}
        >
            <Image
                src={isDark ? 'logo_large_black.png' : 'logo_large_white.png'}
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-5"
            />
            <div className="container mx-auto py-6 max-w-6xl">
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="statement" className="w-full">
                        <div className="flex relative w-full justify-center mb-6">
                            <div className='absolute left-0'><VintageBackButton /></div>
                            <TabsList
                                variant="pills"
                                className="grid w-full max-w-md grid-cols-3 bg-muted/30 backdrop-blur-sm"
                            >
                                <TabsTrigger
                                    value="statement"
                                    icon={<PenToolIcon className="h-4 w-4" />}
                                    className="text-sm font-medium"
                                >
                                    <span className="hidden sm:inline">Text Statement</span>
                                    <span className="sm:hidden">Text</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="tweet"
                                    disabled
                                    icon={<TwitterIcon className="h-4 w-4" />}
                                    className="text-sm font-medium data-[state=active]:bg-cyan-100/50 relative"
                                >
                                    <div className="flex flex-col items-center gap-1 relative">
                                        <div className="flex items-center gap-1">
                                            <span className="hidden sm:inline">Tweet analysis</span>
                                            <span className="sm:hidden">Tweet</span>
                                        </div>
                                        {/* Coming Soon Badge */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                                            className="px-1.5 absolute -top-5 right-0 text-[8px] font-bold rounded-full"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(45deg, #f59e0b, #f97316)'
                                                    : 'linear-gradient(45deg, #f59e0b, #f97316)',
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            Soon
                                        </motion.div>
                                    </div>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="video"
                                    disabled
                                    icon={<Video className="h-4 w-4" />}
                                    className="text-sm font-medium data-[state=active]:bg-red-100/50"
                                >
                                    <div className="flex flex-col items-center gap-1 relative">
                                        <span className="hidden sm:inline">Video Content</span>
                                        <span className="sm:hidden">Video</span>
                                        {/* Coming Soon Badge */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                                            className="px-1.5 absolute -top-5 right-0 text-[8px] font-bold rounded-full"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(45deg, #f59e0b, #f97316)'
                                                    : 'linear-gradient(45deg, #f59e0b, #f97316)',
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            Soon
                                        </motion.div>
                                    </div>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Unified Glass Container for Tab Content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <GlassContainer
                                style="subtle"
                                rounded="2xl"
                                shadow="glow"
                                theme={isDark ? 'dark' : 'light'}
                                overlay={true}
                                overlayOpacity={isDark ? 0.05 : 0.1}
                                className="overflow-hidden backdrop-blur-xl"
                            >
                                <TabsContent value="statement" className="mt-0 border-0 p-0">
                                    <UploadLayout />
                                </TabsContent>
                                <TabsContent value="video" className="mt-0 border-0 p-0">
                                    <UploadVideo />
                                </TabsContent>
                            </GlassContainer>
                        </motion.div>
                    </Tabs>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Page;