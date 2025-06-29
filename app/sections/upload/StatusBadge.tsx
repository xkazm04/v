'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { AnalysisStatus, getStatusConfig } from '@/app/components/research/utils/statusConfig';

interface StatusBadgeProps {
  status: AnalysisStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={className}
    >
      <span
        className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-full`}
        style={{
          background: config.bgColor,
          color: config.color,
          border: `1px solid ${config.borderColor}`
        }}
      >
        <Icon className="h-4 w-4" />
        {config.text}
      </span>
    </motion.div>
  );
}