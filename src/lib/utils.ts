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

export function getClassBadgeColor(className: string): string {
  switch (className?.toLowerCase()) {
    case "7th":
    case "class 7":
    case "class 7th":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "8th":
    case "class 8":
    case "class 8th":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "9th":
    case "class 9":
    case "class 9th":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "10th":
    case "class 10":
    case "class 10th":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status?.toUpperCase()) {
    case "NEW":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "CONTACTED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "COUNSELING":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "ENROLLED":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "REJECTED":
    case "CLOSED":
      return "bg-rose-100 text-rose-800 border-rose-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}
