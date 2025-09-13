import * as React from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

export default function StepItem({
  index,
  title,
  description,
  active,
  onClick,
}: {
  index: number;
  title: string;
  description?: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      // type="button"
      // onClick={onClick}
      className={`
        w-full text-left rounded-lg border p-4 flex transition
        ${active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-backgroundShade1"}
        hover:border-primary/70 hover:bg-backgroundShade2 focus:outline-none focus:ring-2 focus:ring-primary/50
      `}
    >
      {/* Left vertical bar */}
      <div
        className={`
          w-1 rounded-lg self-stretch mr-4
          ${active ? "bg-primary" : "bg-border"}
        `}
      />

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {active ? (
            <CheckCircleRoundedIcon className="text-primary" fontSize="small" />
          ) : (
            <RadioButtonUncheckedRoundedIcon
              className="text-textMuted"
              fontSize="small"
            />
          )}
          <span className="font-bold text-text">{title}</span>
        </div>

        {description ? (
          <p className="text-sm text-textSecondary mt-1">{description}</p>
        ) : (
          <p className="text-xs text-textSecondary mt-1">Step {index}</p>
        )}
      </div>
    </div>
  );
}
