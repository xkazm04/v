'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { CheckCircle, XCircle, AlertTriangle, HelpCircle, Clock, Badge } from 'lucide-react';
import { STATUS_COLORS } from './types';

interface StatusBadgeProps {
  status: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE';
  className?: string;
}

const STATUS_ICONS = {
  TRUE: CheckCircle,
  FALSE: XCircle,
  MISLEADING: AlertTriangle,
  PARTIALLY_TRUE: Clock,
  UNVERIFIABLE: HelpCircle
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = STATUS_ICONS[status];
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={className}
    >
      <Badge 
      //@ts-expect-error Ignore
        variant="outline" 
        className={`${STATUS_COLORS[status]} px-4 py-2 text-sm font-semibold flex items-center gap-2`}
      >
        <Icon className="h-4 w-4" />
        {status.replace('_', ' ')}
      </Badge>
    </motion.div>
  );
}