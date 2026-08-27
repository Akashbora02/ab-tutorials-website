import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getClassBadgeColor(className: string, isDark: boolean = false): string {
  const norm = className?.toLowerCase() || '';
  if (norm.includes('8')) {
    return isDark 
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold";
  }
  if (norm.includes('9')) {
    return isDark 
      ? "bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold"
      : "bg-purple-50 text-purple-700 border-purple-200 font-semibold";
  }
  if (norm.includes('10')) {
    return isDark 
      ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold"
      : "bg-blue-50 text-blue-700 border-blue-200 font-semibold";
  }
  return isDark 
    ? "bg-slate-800 text-slate-300 border-slate-700 font-semibold"
    : "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
}

export function getStatusBadgeColor(status: string, isDark: boolean = false): string {
  switch (status?.toUpperCase()) {
    case "NEW":
      return isDark 
        ? "bg-blue-500/25 text-blue-300 border-blue-400/40 font-bold"
        : "bg-blue-50 text-blue-800 border-blue-200 font-bold";
    case "CONTACTED":
      return isDark 
        ? "bg-purple-500/25 text-purple-300 border-purple-400/40 font-bold"
        : "bg-purple-50 text-purple-800 border-purple-200 font-bold";
    case "COUNSELING":
      return isDark 
        ? "bg-amber-500/25 text-amber-300 border-amber-400/40 font-bold"
        : "bg-amber-50 text-amber-800 border-amber-200 font-bold";
    case "ENROLLED":
      return isDark 
        ? "bg-emerald-500/25 text-emerald-300 border-emerald-400/40 font-bold"
        : "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
    case "REJECTED":
    case "CLOSED":
      return isDark 
        ? "bg-rose-500/25 text-rose-300 border-rose-400/40 font-bold"
        : "bg-rose-50 text-rose-800 border-rose-200 font-bold";
    default:
      return isDark 
        ? "bg-slate-800 text-slate-300 border-slate-700 font-bold"
        : "bg-slate-100 text-slate-800 border-slate-200 font-bold";
  }
}
