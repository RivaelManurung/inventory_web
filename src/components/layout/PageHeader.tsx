"use client";

import React, { useEffect } from "react";
import { Download, Plus } from "lucide-react";
import { useHeader } from "@/context/HeaderContext";

interface PageHeaderProps {
  category: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  stats?: { label: string; value: string | number }[];
}

export default function PageHeader({
  category,
  title,
  subtitle,
  actionLabel,
  onAction,
  stats,
}: PageHeaderProps) {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  const hasContent = subtitle || actionLabel || (stats && stats.length > 0);

  if (!hasContent) return null;

  return (
    <div className="space-y-4 mb-4">
      {(subtitle || actionLabel) && (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground text-xs font-medium rounded-lg hover:bg-accent transition-all">
              <Download size={14} /> Export
            </button>
            {actionLabel && (
              <button
                onClick={onAction}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
              >
                <Plus size={14} /> {actionLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards — matching analytics-cards.tsx pattern from DOTS CA FE */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card p-5 rounded-xl border border-border cursor-default hover:shadow-sm transition-all"
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-1.5 text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
