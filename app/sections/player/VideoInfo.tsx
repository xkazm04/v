'use client';
import { VideoMetadata } from '@/app/types/video';
import { Eye, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { formatTimeAgo, formatViewCount } from '@/app/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { TwitterShareButton } from '@/app/components/ui/Buttons/TwitterShareButton';

interface VideoInfoProps {
  video: VideoMetadata;
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="space-y-6">
      {/* Video Title */}
      <div>
        <h1 className="text-xl font-bold md:text-2xl mb-2">{video.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatViewCount(video.views)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatTimeAgo(video.uploadDate)}</span>
          </div>
          <Badge variant="secondary">{video.category}</Badge>
          <TwitterShareButton
            text="V - "
            hashtags={['factcheck', 'v']}
          />
        </div>
      </div>

      {/* Enhanced Description Card */}
      <div className="border-l-4 border-l-primary bg-primary-100">
        <CardContent className="p-4">
          <div >
            {video.description}

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t space-y-4"
              >
                {/* Enhanced metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Video ID:</span>
                      <span className="font-mono">{video.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload Date:</span>
                      <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <Badge variant="outline" className="text-sm">{video.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Fact-Check Status:</span>
                      <Badge
                        variant="outline"
                        className={`text-sm ${video.factCheck.evaluation === 'Fact' ? 'border-green-400 text-green-600' :
                            video.factCheck.evaluation === 'Mislead' ? 'border-yellow-400 text-yellow-600' :
                              'border-red-400 text-red-600'
                          }`}
                      >
                        {video.factCheck.evaluation}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Share Video
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    Report Issue
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </div>
    </div>
  );
}