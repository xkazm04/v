'use client';

import { motion } from 'framer-motion';
import { Video, Sparkles, PenToolIcon, TwitterIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import UploadLayout from "../sections/upload/uploadQuote/UploadLayout";
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import Image from 'next/image';
import UploadVideo from '../sections/upload/uploadYouTube/UploadVideo';
import TwitterLayout from '../sections/upload/uploadTwitter/TwitterLayout';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

const Page = () => {
    const { isDark } = useLayoutTheme();

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
            {/* Main Container */}
            <div className="container mx-auto py-6 max-w-6xl">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-8"
                    variants={itemVariants}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            className="p-2 rounded-lg bg-primary/10"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sparkles className="h-6 w-6 text-primary" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Fact-Check Analysis
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                        Upload content for comprehensive fact-checking and credibility analysis
                    </p>
                </motion.div>

                {/* Enhanced Tabs */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="statement" className="w-full">
                        <div className="flex justify-center mb-6">
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
                                    icon={<TwitterIcon className="h-4 w-4" />}
                                    className="text-sm font-medium data-[state=active]:bg-cyan-100/50"
                                >
                                    <span className="hidden sm:inline">Tweet analysis</span>
                                    <span className="sm:hidden">Tweet</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="video"
                                    icon={<Video className="h-4 w-4" />}
                                    className="text-sm font-medium data-[state=active]:bg-red-100/50"
                                >
                                    <span className="hidden sm:inline">Video Content</span>
                                    <span className="sm:hidden">Video</span>
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
                                style="frosted"
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
                                <TabsContent value="tweet" className="mt-0 border-0 p-0">
                                    <TwitterLayout />
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