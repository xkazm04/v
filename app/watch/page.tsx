import {  Suspense } from 'react';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import WatchContent from '../sections/player/DesktopPlayer/WatchContent';


export default function WatchPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex relative">
          <Sidebar />
          <div className="flex flex-col items-center justify-center w-full p-6">
            <LoadingScreen />
            <p className="mt-4 text-muted-foreground">
              Initializing watch page...
            </p>
          </div>
        </div>
      }>
        <WatchContent />
      </Suspense>
    </ErrorBoundary>
  );
}