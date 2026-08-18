import { useEffect } from "react";

import type { SiteSettings } from "@/types";

/**
 * Only brand tokens are overridable at runtime. Surface/background/text/border
 * tokens are theme-dependent (dark `:root` vs `.light`), so overriding them
 * inline on <html> would freeze the site in one theme and break the toggle.
 */
const COLOR_MAP: Array<[keyof SiteSettings, string]> = [
  ["primary_color", "--primary"],
  ["accent_color", "--accent"],
  ["gradient_start", "--gradient-start"],
  ["gradient_end", "--gradient-end"],
];


/**
 * Applies admin-configured colours, fonts and custom CSS as runtime overrides.
 * Runs after hydration only, so server and client markup always match.
 */
export function ThemeVars({ settings }: { settings: SiteSettings | null | undefined }) {
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    for (const [field, cssVar] of COLOR_MAP) {
      const value = settings[field];
      if (typeof value === "string" && value.trim()) root.style.setProperty(cssVar, value);
    }
    root.style.setProperty(
      "--font-display-family",
      `"${settings.display_font}", ui-sans-serif, system-ui, sans-serif`,
    );
    root.style.setProperty(
      "--font-body-family",
      `"${settings.body_font}", ui-sans-serif, system-ui, sans-serif`,
    );

    const styleId = "site-custom-css";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (settings.custom_css) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = settings.custom_css;
    } else if (styleEl) {
      styleEl.remove();
    }
  }, [settings]);

  return null;
}
