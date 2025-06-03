import { CheckCircle, XCircle, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "TRUE":
      return {
        icon: CheckCircle,
        color: "#22c55e",
        bgColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.3)",
        text: "Verified True"
      };
    case "FALSE":
      return {
        icon: XCircle,
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        text: "Confirmed False"
      };
    case "MISLEADING":
      return {
        icon: AlertTriangle,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        text: "Misleading Content"
      };
    case "PARTIALLY_TRUE":
      return {
        icon: AlertCircle,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        text: "Partially True"
      };
    default:
      return {
        icon: HelpCircle,
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
        borderColor: "rgba(107, 114, 128, 0.3)",
        text: "Unverifiable"
      };
  }
};

export const getCategoryIcon = (category: string) => {
  const { Heart, Zap, Globe, Building, BookOpen, Users } = require("lucide-react");
  
  switch (category) {
    case "HEALTHCARE": return Heart;
    case "TECHNOLOGY": return Zap;
    case "ENVIRONMENT": return Globe;
    case "ECONOMY": return Building;
    case "EDUCATION": return BookOpen;
    default: return Users;
  }
};