'use client';

import { Input } from "@/app/components/ui/input";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion";
import { Calendar, MapPin, User } from "lucide-react";
import { ResearchRequest } from "../types";

type Props = {
    formData: ResearchRequest;
    handleChange: (field: keyof Props['formData'], value: string) => void;
    handleBlur: (field: keyof Props['formData']) => void;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const ResearchFormContent = ({ formData, handleChange, handleBlur }: Props) => {
  const { colors, isDark } = useLayoutTheme();

  const inputStyle = () => ({
    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    color: colors.foreground,
  });

  return (
    <div className="space-y-6 h-[450px] ">
      {/* Source and Context - Stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Source Input */}
        <motion.div
          variants={fieldVariants}
          className="space-y-3"
        >
          <Label
            htmlFor="source"
            className="flex items-center gap-2 text-sm sm:text-base font-semibold"
            style={{ color: colors.foreground }}
          >
            <User className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>Source</span>
          </Label>
          <textarea
            id="source"
            placeholder="Who made this statement? (e.g., 'John Smith, CEO of XYZ Corp')"
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            onBlur={() => handleBlur('source')}
            className="w-full outline-none h-20 sm:h-24 p-3 sm:p-4 rounded-xl transition-all duration-300 resize-none text-sm sm:text-base leading-relaxed"
            style={inputStyle()}
          />
        </motion.div>

        {/* Context Input */}
        <motion.div
          variants={fieldVariants}
          className="space-y-3"
        >
          <Label
            htmlFor="context"
            className="flex items-center gap-2 text-sm sm:text-base font-semibold"
            style={{ color: colors.foreground }}
          >
            <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span>Context</span>
          </Label>
          <textarea
            id="context"
            placeholder="When and where was this said? (e.g., 'During a press conference on March 15, 2024')"
            value={formData.context}
            onChange={(e) => handleChange('context', e.target.value)}
            onBlur={() => handleBlur('context')}
            className="w-full outline-none h-20 sm:h-24 p-3 sm:p-4 rounded-xl transition-all duration-300 resize-none text-sm sm:text-base leading-relaxed"
            style={inputStyle()}
          />
        </motion.div>
      </div>

      {/* Statement Date - Centered on mobile, left-aligned on larger screens */}
      <motion.div
        variants={fieldVariants}
        className="space-y-3 max-w-full sm:max-w-md"
      >
        <Label
          htmlFor="statement_date"
          className="flex items-center gap-2 text-sm sm:text-base font-semibold"
          style={{ color: colors.foreground }}
        >
          <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span>Statement Date</span>
        </Label>
        <Input
          id="statement_date"
          type="date"
          value={formData.statement_date}
          onChange={(e) => handleChange('statement_date', e.target.value)}
          onBlur={() => handleBlur('statement_date')}
          className="h-12 sm:h-14 border-none outline-none px-3 sm:px-4 text-sm sm:text-base rounded-xl transition-all duration-300 w-full"
          style={inputStyle()}
        />
      </motion.div>
    </div>
  );
};

export default ResearchFormContent;