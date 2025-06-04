'use client';

import React from 'react';
import { FeedSection } from '@/app/sections/home/FeedSection';
import { motion } from 'framer-motion';

export default function SearchFilterDemo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Demo Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Search & Filter Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience comprehensive search and filtering capabilities for fact-checked news and videos. 
            Use the navbar search, category filters, and advanced sidebar filters to find exactly what you're looking for.
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold mb-2">Global Search</h3>
            <p className="text-sm text-muted-foreground">
              Search across both news and videos simultaneously from the navbar search bar
            </p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl mb-2">🏷️</div>
            <h3 className="font-semibold mb-2">Smart Categorization</h3>
            <p className="text-sm text-muted-foreground">
              Filter by 11+ categories including Politics, Economy, Healthcare, and Technology
            </p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl mb-2">🌍</div>
            <h3 className="font-semibold mb-2">Country & Source Filters</h3>
            <p className="text-sm text-muted-foreground">
              Filter by country, fact-check status, source platform, and date ranges
            </p>
          </div>
        </motion.div>

        {/* Main Feed Section */}
        <FeedSection />
      </div>
    </motion.div>
  );
}