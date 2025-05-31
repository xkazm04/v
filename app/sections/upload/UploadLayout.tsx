'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ResearchForm } from './ResearchForm';
import { ResearchResults } from './ResearchResults';
import type { ResearchRequest, ResearchResponse } from './types';

export default function UploadLayout() {
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async (data: ResearchRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/fc/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to research statement: ${response.statusText}`);
      }

      const researchResult: ResearchResponse = await response.json();
      setResult(researchResult);
      toast.success('Fact-check completed successfully!');
    } catch (error) {
      console.error('Research failed:', error);
      toast.error('Failed to research statement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-primary">Test statements</h1>
          <p className="text-lg text-neutral-200">
            Fill statement in text form, context and date
          </p>
        </motion.div>

        {/* Form */}
        <ResearchForm onSubmit={handleResearch} isLoading={isLoading} />

        {/* Results */}
        <ResearchResults result={result} isLoading={isLoading} />
      </div>
    </div>
  );
}