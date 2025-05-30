export const MetadataItem = ({ icon, text, className = "", config }: { 
    icon: React.ReactNode; 
    text: string; 
    className?: string;
    config: {
        metaClass: string;
    };
  }) => (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-muted-foreground/70">
        {icon}
      </span>
      <span className={config.metaClass}>
        {text}
      </span>
    </div>
  );
