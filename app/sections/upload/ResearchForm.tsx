'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardContent } from '../../components/ui/card';
import type { ResearchRequest } from './types';
import ResearchFormSubmit from './ResearchFormSubmit';
import ResearchFormContent from './ResearchFormContent';
import ResearchFormStatement from './ResearchFormStatement';
import PredefinedStatements from './PredefinedStatements';

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => Promise<void>;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

export function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [formData, setFormData] = useState<ResearchRequest>({
    statement: '',
    source: '',
    context: '',
    datetime: new Date().toISOString(),
    statement_date: new Date().toISOString().split('T')[0]
  });
  const [mode, setMode] = useState<'predefined' | 'custom'>('predefined');
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

  const handlePredefinedSelect = (statement: any) => {
    setFormData({
      statement: statement.quote,
      source: statement.speaker,
      context: statement.context,
      datetime: new Date().toISOString(),
      statement_date: statement.date
    });
    setErrors({});
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >

      <CardContent className="pb-6 sm:pb-8">
        <motion.div
          className="text-center mb-8"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent mb-2">
            Quote fast-check
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground font-normal max-w-md leading-relaxed">
            Write or select a statement and get your insights
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ResearchFormStatement
            formData={formData}
            handleChange={handleChange}
            mode={mode}
            setMode={setMode}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />

          <AnimatePresence mode="wait">
            {mode === 'predefined' ? (
              <motion.div
                key="predefined"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <PredefinedStatements
                  onSelect={handlePredefinedSelect}
                  selectedStatement={formData.statement}
                />
              </motion.div>
            ) : (
              <motion.div
                key="custom"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <ResearchFormContent
                  formData={formData}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ResearchFormSubmit
            formData={formData}
            isLoading={isLoading}
          />
        </form>
      </CardContent>
    </motion.div>
  );
}