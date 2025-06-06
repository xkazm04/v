'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardContent } from '../../components/ui/card';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import type { ResearchRequest } from './types';
import ResearchFormSubmit from './ResearchFormSubmit';
import ResearchFormContent from './ResearchFormContent';
import ResearchFormStatement from './ResearchFormStatement';
import ResearchFormHeader from './ResearchFormHeader';

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => Promise<void>;
  isLoading: boolean;
}

export function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const { isDark } = useLayoutTheme();
  const [formData, setFormData] = useState<ResearchRequest>({
    statement: '',
    source: '',
    context: '',
    datetime: new Date().toISOString(),
    statement_date: new Date().toISOString().split('T')[0] 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.statement.trim()) {
      newErrors.statement = 'Statement is required';
    } else if (formData.statement.trim().length < 10) {
      newErrors.statement = 'Statement must be at least 10 characters';
    }

    setErrors(newErrors);
    setTouched({ statement: true, source: true, context: true, statement_date: true });

    if (Object.keys(newErrors).length === 0) {
      await onSubmit({
        ...formData,
        datetime: new Date().toISOString(),
        statement_date: formData.statement_date || undefined
      });
    }
  };

  const handleChange = (field: keyof ResearchRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <div
        className="rounded-2xl border-2 overflow-hidden shadow-xl"
        style={{
          background: isDark 
            ? `linear-gradient(135deg, 
                rgba(15, 23, 42, 0.95) 0%,
                rgba(30, 41, 59, 0.98) 50%,
                rgba(51, 65, 85, 0.95) 100%
              )`
            : `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%,
                rgba(248, 250, 252, 0.98) 50%,
                rgba(241, 245, 249, 0.95) 100%
              )`,
          border: `2px solid ${isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.6)'}`,
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(71, 85, 105, 0.2)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.3)'
        }}
      >
        <ResearchFormHeader />
        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Statement Input */}
            <ResearchFormStatement
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
            {/* Grid Layout for Additional Fields */}
            <ResearchFormContent
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              />
            {/* Submit Button */}
            <ResearchFormSubmit
              formData={formData}
              isLoading={isLoading}
              />
          </form>
        </CardContent>
      </div>
    </motion.div>
  );
}