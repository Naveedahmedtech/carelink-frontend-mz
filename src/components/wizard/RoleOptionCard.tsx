import * as React from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Tooltip } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

type Props = {
  checked: boolean;
  icon: React.ElementType;
  label: string;
  description: string;
  onSelect: () => void;
  disabled?: boolean;
  dense?: boolean;
  name?: string;
  id?: string;
  "data-testid"?: string;
};

const RoleOptionCard = React.memo(
  React.forwardRef<HTMLDivElement, Props>(function RoleOptionCard(
    {
      checked,
      icon: Icon,
      label,
      description,
      onSelect,
      disabled,
      dense,
      name,
      id,
      ...rest
    },
    ref
  ) {
    const uid = React.useId();
    const radioId = id ?? uid;
    const labelId = `${radioId}-label`;
    const descId = `${radioId}-desc`;

    const padding = dense ? "p-4" : "p-6";

    return (
      <div
        ref={ref}
        role="none"
        aria-disabled={disabled || undefined}
        className={`
          relative rounded-2xl border backdrop-blur-sm
          transition-all duration-300 ease-out
          ${checked 
            ? "border-primary shadow-lg bg-gradient-to-br from-primary/10 to-backgroundShade1" 
            : "border-border bg-background"} 
          ${disabled 
            ? "opacity-60 cursor-not-allowed" 
            : "hover:shadow-xl hover:scale-[1.01]"} 
        `}
        {...rest}
      >
        {/* Native radio */}
        <input
          type="radio"
          id={radioId}
          name={name}
          checked={checked}
          readOnly
          aria-labelledby={labelId}
          aria-describedby={descId}
          style={visuallyHidden as React.CSSProperties}
          tabIndex={-1}
        />

        <button
          type="button"
          onClick={!disabled ? onSelect : undefined}
          disabled={disabled}
          className={`
            w-full text-left rounded-2xl transition-transform
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
            active:scale-[0.995] ${padding}
          `}
        >
          <div className="flex items-center space-x-4">
            {/* Icon circle */}
            <div
              aria-hidden
              className={`
                w-12 h-12 rounded-full grid place-items-center flex-shrink-0
                transition-all duration-300
                ${checked 
                  ? "bg-primary/20 text-primary ring-2 ring-primary/50" 
                  : "bg-primary/10 text-text"} 
              `}
            >
              <Icon fontSize="medium" />
            </div>

            {/* Label + description */}
            <div className="flex-1">
              <div
                id={labelId}
                className="font-semibold text-lg leading-snug text-text"
              >
                {label}
              </div>
              <Tooltip title={description} disableInteractive enterDelay={600}>
                <p
                  id={descId}
                  className="text-sm text-textSecondary line-clamp-2"
                >
                  {description}
                </p>
              </Tooltip>
            </div>

            {/* Check badge */}
            <div
              aria-hidden
              className={`
                ml-2 w-6 h-6 rounded-full grid place-items-center flex-shrink-0
                transition-all duration-300
                ${checked 
                  ? "bg-primary text-white scale-110 shadow-md" 
                  : "border-2 border-border bg-background"}
              `}
            >
              {checked && (
                <CheckCircleRoundedIcon fontSize="small" className="animate-scaleIn" />
              )}
            </div>
          </div>
        </button>
      </div>
    );
  })
);

export default RoleOptionCard;
