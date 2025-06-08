'use client';

import { useParams } from 'next/navigation';
import { useResearchById } from '@/app/hooks/useNews';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import Link from 'next/link';
import { StatusBadge } from '@/app/sections/upload/StatusBadge';
import { ResearchResults } from '@/app/sections/upload/ResearchResults';

export default function ResearchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: research, isLoading, error } = useResearchById(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !research) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold text-foreground">Research Not Found</h1>
          <p className="text-muted-foreground">
            The research article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-4">
                    {research.statement}
                  </CardTitle>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <StatusBadge status={research.status} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(research.processed_at).toLocaleDateString()}
                    </div>
                    
                    {research.source && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {research.source}
                      </div>
                    )}

                    {research.statement_date && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        Statement Date: {new Date(research.statement_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {research.context && (
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Context</h4>
                  <p className="text-sm text-muted-foreground">{research.context}</p>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Research Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ResearchResults result={research} isLoading={false} />
        </motion.div>
      </div>
    </div>
  );
}