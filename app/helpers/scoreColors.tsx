import { useLayoutTheme } from "../hooks/use-layout-theme";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Minus, TrendingDown } from "lucide-react";

export const getScoreColor = (score: number) => {
    const {  isDark } = useLayoutTheme();
    if (score >= 80) {
      return {
        primary: isDark ? '#22c55e' : '#16a34a',
        secondary: isDark ? '#22c55e40' : '#16a34a30',
        background: isDark ? '#22c55e15' : '#16a34a10'
      };
    } else if (score >= 60) {
      return {
        primary: isDark ? '#84cc16' : '#65a30d',
        secondary: isDark ? '#84cc1640' : '#65a30d30',
        background: isDark ? '#84cc1615' : '#65a30d10'
      };
    } else if (score >= 40) {
      return {
        primary: isDark ? '#eab308' : '#ca8a04',
        secondary: isDark ? '#eab30840' : '#ca8a0430',
        background: isDark ? '#eab30815' : '#ca8a0410'
      };
    } else if (score >= 20) {
      return {
        primary: isDark ? '#f97316' : '#ea580c',
        secondary: isDark ? '#f9731640' : '#ea580c30',
        background: isDark ? '#f9731615' : '#ea580c10'
      };
    } else {
      return {
        primary: isDark ? '#ef4444' : '#dc2626',
        secondary: isDark ? '#ef444440' : '#dc262630',
        background: isDark ? '#ef444415' : '#dc262610'
      };
    }
  };

export const getStatusIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-4 h-4" />;
    if (score >= 40) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

export const getTrendIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-3 h-3" />;
    if (score >= 40) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };
