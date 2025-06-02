'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {  CheckCircle, XCircle } from 'lucide-react';
import type { ResourceAnalysis } from './types';
import { getCountryFlag, getCredibilityColor, getMediaCategoryIcon } from '@/app/helpers/researchResultHelpers';

interface ResourceAnalysisCardProps {
  title: string;
  resourceAnalysis: ResourceAnalysis;
  type: 'supporting' | 'contradicting';
  isLoading: boolean;
}

export function ResourceAnalysisCard({ title, resourceAnalysis, type, isLoading }: ResourceAnalysisCardProps) {
  const isSupporting = type === 'supporting';
  const Icon = isSupporting ? CheckCircle : XCircle;
  const colorClass = isSupporting ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50';
  const iconColor = isSupporting ? 'text-green-600' : 'text-red-600';

  return (
    <Card className={`${colorClass} ${isLoading ? 'animate-pulse' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
          <Badge variant="outline" className="ml-auto">
            {resourceAnalysis.total}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Source Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Mainstream:</span>
              <span className="font-medium">{resourceAnalysis.mainstream}</span>
            </div>
            <div className="flex justify-between">
              <span>Governance:</span>
              <span className="font-medium">{resourceAnalysis.governance}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Academic:</span>
              <span className="font-medium">{resourceAnalysis.academic}</span>
            </div>
            <div className="flex justify-between">
              <span>Medical:</span>
              <span className="font-medium">{resourceAnalysis.medical}</span>
            </div>
          </div>
        </div>

        {/* Major Countries */}
        {resourceAnalysis.major_countries.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Major Countries:</p>
            <div className="flex flex-wrap gap-1">
              {resourceAnalysis.major_countries.map((country, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {getCountryFlag(country)} {country.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {resourceAnalysis.references.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Key References:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {resourceAnalysis.references.slice(0, 3).map((reference, index) => {
                const CategoryIcon = getMediaCategoryIcon(reference.category);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-2 hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <CategoryIcon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-left font-normal text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => window.open(reference.url, '_blank')}
                          disabled={isLoading}
                        >
                          <span className="truncate block">{reference.title}</span>
                        </Button>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className={`text-xs ${getCredibilityColor(reference.credibility)}`}>
                            {reference.credibility}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {getCountryFlag(reference.country)} {reference.country.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {reference.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {resourceAnalysis.references.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{resourceAnalysis.references.length - 3} more sources
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}