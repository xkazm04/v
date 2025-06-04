import { Skeleton } from "../skeleton";

function SidebarSkeleton() {
  return (
    <div className="w-[280px] h-[calc(100vh-3.5rem)] border-r border-border/40 bg-background/95 p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
export default SidebarSkeleton;