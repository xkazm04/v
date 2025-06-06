'use client';

interface BackgroundPatternProps {
  isDark: boolean;
}

export function BackgroundPattern({ isDark }: BackgroundPatternProps) {
  return (
    <div className="absolute inset-0 opacity-[0.03]">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`
            : `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
}