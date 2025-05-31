import {  Clock, CheckCircle, XCircle } from 'lucide-react';

  export const getSegmentIcon = (type: 'truth' | 'neutral' | 'lie') => {
    switch (type) {
      case 'truth': return <CheckCircle className="h-4 w-4" />;
      case 'neutral': return <Clock className="h-4 w-4" />;
      case 'lie': return <XCircle className="h-4 w-4" />;
    }
  };

export const getSegmentColor = (veracity: string) => {
  switch (veracity) {
    case 'true':
    case 'truth':
      return 'bg-green-500';
    case 'false':
    case 'lie':
      return 'bg-red-500';
    case 'neutral':
    default:
      return 'bg-gray-500';
  }
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};