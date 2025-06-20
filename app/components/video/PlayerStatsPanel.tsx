'use client';

import { FactCheckResult } from '@/app/types/video';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Shield, AlertTriangle, XCircle, CheckCircle, TrendingUp, FileText } from 'lucide-react';

interface FactCheckPanelProps {
  factCheck: FactCheckResult;
}

export function PlayerStatsPanel({ factCheck }: FactCheckPanelProps) {
  const getEvaluationIcon = () => {
    switch (factCheck.evaluation) {
      case 'Fact':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Mislead':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Lie':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getEvaluationColor = () => {
    switch (factCheck.evaluation) {
      case 'Fact':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Mislead':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Lie':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="border-l-4 border-l-primary bg-primary-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5" />
          Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Evaluation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getEvaluationIcon()}
            <span className="font-medium">Overall Rating:</span>
          </div>
          <Badge className={getEvaluationColor()}>
            {factCheck.evaluation}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Confidence Score</span>
            <span className="text-sm text-muted-foreground">{factCheck.confidence}%</span>
          </div>
          <Progress value={factCheck.confidence} className="h-2" />
        </div>

        {/* Truth Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Truth Distribution</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Factual</span>
              <span className="text-sm text-green-600">{factCheck.truthPercentage}%</span>
            </div>
            <Progress value={factCheck.truthPercentage} className="h-1.5 bg-green-100" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Neutral</span>
              <span className="text-sm text-gray-600">{factCheck.neutralPercentage}%</span>
            </div>
            <Progress value={factCheck.neutralPercentage} className="h-1.5 bg-gray-100" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Misleading</span>
              <span className="text-sm text-red-600">{factCheck.misleadingPercentage}%</span>
            </div>
            <Progress value={factCheck.misleadingPercentage} className="h-1.5 bg-red-100" />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{factCheck.verifiedClaims}/{factCheck.totalClaims}</span>
            </div>
            <p className="text-xs text-muted-foreground">Verified Claims</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{factCheck.sources}</span>
            </div>
            <p className="text-xs text-muted-foreground">Sources</p>
          </div>
        </div>
      </CardContent>
    </div>
  );
}