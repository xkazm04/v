'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Search, Loader2, Calendar } from 'lucide-react';
import type { ResearchRequest } from './types';

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => Promise<void>;
  isLoading: boolean;
}

export function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [formData, setFormData] = useState<ResearchRequest>({
    statement: '',
    source: '',
    context: '',
    datetime: new Date().toISOString(),
    statement_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      datetime: new Date().toISOString(),
      statement_date: formData.statement_date || undefined
    });
  };

  const handleChange = (field: keyof ResearchRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto bg-secondary rounded-xl border border-gray-400/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="h-6 w-6" />
            Fact-Check Research
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="statement" className="text-base font-medium">
                Statement to Fact-Check *
              </Label>
              <Textarea
                id="statement"
                placeholder="Enter the statement you want to fact-check..."
                value={formData.statement}
                onChange={(e) => handleChange('statement', e.target.value)}
                className="min-h-24 resize-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-base font-medium">
                  Source
                </Label>
                <Textarea
                  id="source"
                  placeholder="Who said this or where did it come from?"
                  value={formData.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context" className="text-base font-medium">
                  Context
                </Label>
                <Textarea
                  id="context"
                  placeholder="When and where was this said?"
                  value={formData.context}
                  onChange={(e) => handleChange('context', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statement_date" className="text-base font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Statement Date
                </Label>
                <Input
                  id="statement_date"
                  type="date"
                  placeholder="When was this said?"
                  value={formData.statement_date}
                  onChange={(e) => handleChange('statement_date', e.target.value)}
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={!formData.statement.trim() || isLoading}
                className="w-full h-12 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Research
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </div>
    </motion.div>
  );
}