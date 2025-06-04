type Props = {
  isCompact?: boolean;
  article: {
    headline: string;
    source: {
      name: string;
      logoUrl?: string;
    };
    publishedAt: string;
  };
}

// Safe date formatting function
const formatSafeDate = (dateString: string): string => {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
};

const NewsCardContent = ({isCompact, article}: Props) => {
  return <>
    <div className="relative z-10 flex flex-col h-full justify-between p-4">

      {/* Quote/Statement */}
      <div className="flex-1 flex items-center">
        <blockquote className={`
                  text-slate-700 dark:text-slate-300 font-medium leading-relaxed
                  ${isCompact ? 'text-sm line-clamp-2' : 'md:text-sm lg:text-md 2xl:text-lg line-clamp-4'}
                  transition-colors duration-200
                  group-hover:text-slate-900 dark:group-hover:text-slate-100
                `}>
          "{article.headline}"
        </blockquote>
      </div>

      {/* Bottom Section: Source + Verdict */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">

        {/* Source */}
        <div className="flex w-full flex-row items-center space-x-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {article.source.name}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatSafeDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  </>
}

export default NewsCardContent;