import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle,
  Users, 
  Building, 
  GraduationCap, 
  Heart,
  Scale,
  FileText,
  DollarSign,
  Monitor,
  ShieldCheck,
  Globe,
  Zap,
  BookOpen,
  MessageSquare,
  AlertOctagon,
  EyeOff
} from "lucide-react";

export const getStatusConfig = (status: AnalysisStatus) => {
  switch (status) {
    case "TRUE":
      return {
        icon: CheckCircle,
        color: "#22c55e",
        bgColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.3)",
        text: "Verified True",
        translationKey: "status_verified_true"
      };
    case "FACTUAL_ERROR":
      return {
        icon: XCircle,
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        text: "Factual Error",
        translationKey: "status_factual_error"
      };
    case "DECEPTIVE_LIE":
      return {
        icon: AlertOctagon,
        color: "#b91c1c",
        bgColor: "rgba(185, 28, 28, 0.1)",
        borderColor: "rgba(185, 28, 28, 0.3)",
        text: "Deceptive Lie",
        translationKey: "status_deceptive_lie"
      };
    case "MANIPULATIVE":
      return {
        icon: AlertTriangle,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        text: "Manipulative",
        translationKey: "status_manipulative"
      };
    case "PARTIALLY_TRUE":
      return {
        icon: AlertCircle,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        text: "Partially True",
        translationKey: "status_partially_true"
      };
    case "OUT_OF_CONTEXT":
      return {
        icon: EyeOff,
        color: "#a21caf",
        bgColor: "rgba(162, 28, 175, 0.1)",
        borderColor: "rgba(162, 28, 175, 0.3)",
        text: "Out of Context",
        translationKey: "status_out_of_context"
      };
    case "UNVERIFIABLE":
    default:
      return {
        icon: HelpCircle,
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
        borderColor: "rgba(107, 114, 128, 0.3)",
        text: "Unverifiable",
        translationKey: "status_unverifiable"
      };
  }
};
export const getVerdictIcon = (status: AnalysisStatus) => {
  switch (status) {
    case "TRUE": return CheckCircle;
    case "FACTUAL_ERROR": return XCircle;
    case "DECEPTIVE_LIE": return AlertOctagon;
    case "MANIPULATIVE": return AlertTriangle;
    case "PARTIALLY_TRUE": return AlertCircle;
    case "OUT_OF_CONTEXT": return EyeOff;
    case "UNVERIFIABLE": default: return HelpCircle;
  }
};
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "HEALTHCARE": return Heart;
    case "TECHNOLOGY": return Zap;
    case "ENVIRONMENT": return Globe;
    case "ECONOMY": return Building;
    case "EDUCATION": return BookOpen;
    default: return Users;
  }
};

export const SOURCE_CATEGORIES = {
  MAINSTREAM: 'mainstream',
  GOVERNANCE: 'governance',
  ACADEMIC: 'academic',
  MEDICAL: 'medical',
  LEGAL: 'legal',
  POLICY: 'policy',
  ECONOMIC: 'economic',
  TECHNOLOGY: 'technology',
  FACT_CHECKING: 'fact_checking',
  INTERNATIONAL: 'international',
  OTHER: 'other'
} as const;

export type SourceCategoryType = typeof SOURCE_CATEGORIES[keyof typeof SOURCE_CATEGORIES];

// ✅ NEW: Source category configurations with icons and labels
export const SOURCE_CATEGORY_CONFIG = {
  [SOURCE_CATEGORIES.MAINSTREAM]: {
    icon: Users,
    label: 'Mainstream',
    description: 'Traditional media and news sources',
    translationKey: 'source_mainstream'
  },
  [SOURCE_CATEGORIES.GOVERNANCE]: {
    icon: Building,
    label: 'Government',
    description: 'Government agencies and official sources',
    translationKey: 'source_government'
  },
  [SOURCE_CATEGORIES.ACADEMIC]: {
    icon: GraduationCap,
    label: 'Academic',
    description: 'Research institutions and academic sources',
    translationKey: 'source_academic'
  },
  [SOURCE_CATEGORIES.MEDICAL]: {
    icon: Heart,
    label: 'Medical',
    description: 'Healthcare and medical organizations',
    translationKey: 'source_medical'
  },
  [SOURCE_CATEGORIES.LEGAL]: {
    icon: Scale,
    label: 'Legal',
    description: 'Legal institutions and court documents',
    translationKey: 'source_legal'
  },
  [SOURCE_CATEGORIES.POLICY]: {
    icon: FileText,
    label: 'Policy',
    description: 'Policy documents and regulatory sources',
    translationKey: 'source_policy'
  },
  [SOURCE_CATEGORIES.ECONOMIC]: {
    icon: DollarSign,
    label: 'Economic',
    description: 'Financial and economic institutions',
    translationKey: 'source_economic'
  },
  [SOURCE_CATEGORIES.TECHNOLOGY]: {
    icon: Monitor,
    label: 'Technology',
    description: 'Tech companies and digital platforms',
    translationKey: 'source_technology'
  },
  [SOURCE_CATEGORIES.FACT_CHECKING]: {
    icon: ShieldCheck,
    label: 'Fact Check',
    description: 'Professional fact-checking organizations',
    translationKey: 'source_fact_check'
  },
  [SOURCE_CATEGORIES.INTERNATIONAL]: {
    icon: Globe,
    label: 'International',
    description: 'International organizations and bodies',
    translationKey: 'source_international'
  },
  [SOURCE_CATEGORIES.OTHER]: {
    icon: Users,
    label: 'Other',
    description: 'Other verified sources',
    translationKey: 'source_other'
  }
} as const;

// ✅ NEW: Helper function to get source category icon
export const getSourceCategoryIcon = (category: string) => {
  const config = SOURCE_CATEGORY_CONFIG[category as SourceCategoryType];
  return config ? config.icon : Users;
};

// ✅ NEW: Helper function to get source category label
export const getSourceCategoryLabel = (category: string) => {
  const config = SOURCE_CATEGORY_CONFIG[category as SourceCategoryType];
  return config ? config.label : 'Unknown';
};

// ✅ NEW: Helper function to get all source categories for iteration
export const getAllSourceCategories = () => {
  return Object.entries(SOURCE_CATEGORY_CONFIG).map(([key, config]) => ({
    key: key as SourceCategoryType,
    ...config
  }));
};


export const mapExpertToProfile = (expertName: string, expertiseArea?: string) => {
  const name = expertName.toLowerCase();
  if (name.includes('nerd') || name.includes('researcher') || name.includes('academic')) return 'nerd';
  if (name.includes('devil') || name.includes('skeptic') || name.includes('critic')) return 'devil';
  if (name.includes('critic') || name.includes('reviewer') || name.includes('media')) return 'critic';
  if (name.includes('psychic') || name.includes('predictor') || name.includes('trend')) return 'psychic';
  return 'nerd'; 
};

export const ANALYSIS_STATUSES = [
  "TRUE",
  "FACTUAL_ERROR",
  "DECEPTIVE_LIE",
  "MANIPULATIVE",
  "PARTIALLY_TRUE",
  "OUT_OF_CONTEXT",
  "UNVERIFIABLE"
] as const;

export type AnalysisStatus = typeof ANALYSIS_STATUSES[number];

/**
 * Normalize any incoming status string to a canonical AnalysisStatus.
 * Accepts legacy, API, or alternate status codes.
 */
export function normalizeAnalysisStatus(status: string | undefined | null): AnalysisStatus {
  if (!status) return "UNVERIFIABLE";
  const s = status.toUpperCase();
  switch (s) {
    case "TRUE":
      return "TRUE";
    case "FALSE":
    case "FACTUAL_ERROR":
      return "FACTUAL_ERROR";
    case "MISLEADING":
    case "DECEPTIVE_LIE":
      return "DECEPTIVE_LIE";
    case "MANIPULATIVE":
      return "MANIPULATIVE";
    case "PARTIALLY_TRUE":
      return "PARTIALLY_TRUE";
    case "OUT_OF_CONTEXT":
      return "OUT_OF_CONTEXT";
    case "UNVERIFIABLE":
      return "UNVERIFIABLE";
    default:
      return "UNVERIFIABLE";
  }
}
