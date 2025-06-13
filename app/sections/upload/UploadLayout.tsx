'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ResearchForm } from './ResearchForm';
import { ResearchResults } from './ResearchResults';
import type { ResearchRequest } from './types';
import { LLMResearchResponse } from '@/app/types/research';

export default function UploadLayout() {
  const [result, setResult] = useState<LLMResearchResponse | null>(null);
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

      const researchResult: LLMResearchResponse = await response.json();
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
    <div className="">
      <div className="space-y-8">
        {/* Form */}
        <ResearchForm onSubmit={handleResearch} isLoading={isLoading} />

        {/* Results */}
        <ResearchResults result={result} isLoading={isLoading} />
      </div>
    </div>
  );
}