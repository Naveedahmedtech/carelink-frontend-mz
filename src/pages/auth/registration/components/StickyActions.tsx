import * as React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  disabled?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  note?: string;
};

export default function StickyActions({
  disabled = false,
  onBack,
  onContinue,
  note = "By continuing, you confirm details are accurate and up to date.",
}: Props) {
  const navigate = useNavigate();

  return (
    <footer
      className="
        sticky bottom-0 z-20 pt-3 mt-6
        backdrop-blur-md bg-background/70
        border-t border-border
        shadow-[0_-2px_12px_rgba(0,0,0,0.05)]
      "
    >
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 px-2 sm:px-0">
        {note && (
          <p className="text-xs text-textSecondary max-w-md leading-snug">
            {note}
          </p>
        )}

        <div className="flex w-full sm:w-auto gap-2">
          {/* Back Button */}
          {/* <button
            type="button"
            aria-label="Go back"
            onClick={onBack ?? (() => navigate(-1))}
            className="
              flex-1 sm:flex-none rounded-lg border border-border px-4 py-2
              text-sm font-medium text-text bg-background
              hover:bg-backgroundShade2 active:scale-[0.98]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
              transition-all
            "
          >
            Back
          </button> */}

          {/* Continue Button */}
          <button
            type="submit"
            aria-label="Continue to next step"
            disabled={disabled}
            onClick={onContinue}
            className={`
              flex-1 sm:flex-none rounded-lg px-5 py-2.5 text-sm font-semibold
              text-white bg-primary shadow-sm
              hover:bg-hover active:scale-[0.98]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Continue
          </button>
        </div>
      </div>
    </footer>
  );
}
