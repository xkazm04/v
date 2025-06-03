import {  AlertTriangle, CheckCircle, XCircle } from "lucide-react";
export const colors = {
    light: {
      active: `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%,
        rgba(248, 250, 252, 0.98) 100%
      )`,
      inactive: `linear-gradient(135deg, 
        rgba(248, 250, 252, 0.6) 0%,
        rgba(241, 245, 249, 0.7) 100%
      )`,
      text: 'rgb(51, 65, 85)',
      textSecondary: 'rgb(100, 116, 139)',
      iconBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(243, 232, 255, 0.6))',
      iconBorder: 'rgba(59, 130, 246, 0.3)',
      badgeBg: 'rgba(239, 246, 255, 0.8)',
      badgeBorder: 'rgba(59, 130, 246, 0.3)',
      badgeText: 'rgb(29, 78, 216)'
    },
    dark: {
      active: `linear-gradient(135deg, 
        rgba(15, 23, 42, 0.95) 0%,
        rgba(30, 41, 59, 0.98) 100%
      )`,
      inactive: `linear-gradient(135deg, 
        rgba(71, 85, 105, 0.1) 0%,
        rgba(100, 116, 139, 0.15) 100%
      )`,
      text: 'rgb(203, 213, 225)',
      textSecondary: 'rgb(148, 163, 184)',
      iconBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
      iconBorder: 'rgba(59, 130, 246, 0.2)',
      badgeBg: 'rgba(59, 130, 246, 0.1)',
      badgeBorder: 'rgba(59, 130, 246, 0.3)',
      badgeText: 'rgb(96, 165, 250)'
    }
  };

export const statusColorConfig = {
    light: {
        TRUE: {
            color: "#16a34a",
            icon: CheckCircle,
            label: "VERIFIED",
            bgGradient: "linear-gradient(135deg, rgba(220, 252, 231, 0.95) 0%, rgba(187, 247, 208, 0.98) 30%, rgba(34, 197, 94, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        FALSE: {
            color: "#dc2626",
            icon: XCircle,
            label: "FALSE",
            bgGradient: "linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(252, 165, 165, 0.98) 30%, rgba(239, 68, 68, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        MISLEADING: {
            color: "#d97706",
            icon: AlertTriangle,
            label: "MISLEADING",
            bgGradient: "linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(252, 211, 77, 0.98) 30%, rgba(245, 158, 11, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        PARTIALLY_TRUE: {
            color: "#2563eb",
            icon: CheckCircle,
            label: "PARTIAL",
            bgGradient: "linear-gradient(135deg, rgba(219, 234, 254, 0.95) 0%, rgba(147, 197, 253, 0.98) 30%, rgba(59, 130, 246, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        UNVERIFIABLE: {
            color: "#7c3aed",
            icon: AlertTriangle,
            label: "UNCLEAR",
            bgGradient: "linear-gradient(135deg, rgba(237, 233, 254, 0.95) 0%, rgba(196, 181, 253, 0.98) 30%, rgba(139, 92, 246, 0.15) 100%)",
            stampOpacity: "0.08"
        }
    },
    dark: {
        TRUE: {
            color: "#22c55e",
            icon: CheckCircle,
            label: "VERIFIED",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(34, 197, 94, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        FALSE: {
            color: "#ef4444",
            icon: XCircle,
            label: "FALSE",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(239, 68, 68, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        MISLEADING: {
            color: "#f59e0b",
            icon: AlertTriangle,
            label: "MISLEADING",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(245, 158, 11, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        PARTIALLY_TRUE: {
            color: "#3b82f6",
            icon: CheckCircle,
            label: "PARTIAL",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(59, 130, 246, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        UNVERIFIABLE: {
            color: "#8b5cf6",
            icon: AlertTriangle,
            label: "UNCLEAR",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(139, 92, 246, 0.15) 100%)",
            stampOpacity: "0.05"
        }
    }
};