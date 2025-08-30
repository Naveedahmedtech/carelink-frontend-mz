import * as React from "react";
import AppBar from "./AppBar";

type Props = {
  children: React.ReactNode;
};

export default function PremiumLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <AppBar />

      {/* Main content */}
      <main className="mx-auto max-w-7xl w-full flex-1 py-4 md:py-12 px-2 md:px-6">
        <div
          className="
            bg-backgroundShade1 border border-border rounded-2xl 
            shadow-lg
          "
        >
          {children}
        </div>
      </main>
    </div>
  );
}
