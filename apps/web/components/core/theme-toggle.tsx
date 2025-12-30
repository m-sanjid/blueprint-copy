"use client";

import { useTheme } from "next-themes";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { cn } from "@workspace/ui/lib/utils";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-black/5",
        "transition-colors duration-300 hover:bg-muted",
        "dark:border-neutral-800 dark:bg-white/5",
        className
      )}
    >
      {/* Moon */}
      <span
        className={cn(
          "absolute inset-0 grid place-items-center",
          "transition-all duration-300 ease-out",
          isDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 -rotate-90"
        )}
      >
        <IconMoonFilled className="size-4" />
      </span>

      {/* Sun */}
      <span
        className={cn(
          "absolute inset-0 grid place-items-center",
          "transition-all duration-300 ease-out",
          isDark
            ? "opacity-0 scale-75 rotate-90"
            : "opacity-100 scale-100 rotate-0"
        )}
      >
        <IconSunFilled className="size-4" />
      </span>
    </button>
  );
};

export default ThemeToggle;
