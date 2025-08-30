import * as React from "react";

type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  subtitle?: string;
};

export default function SectionCard({ title, icon, children, subtitle }: Props) {
  return (
    <div
      className="
        rounded-2xl bg-backgroundShade1 border border-border/70
        overflow-hidden transition 
      "
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-text">{title}</h3>
          {subtitle && (
            <p className="text-sm text-textSecondary mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}
