/**
 * Utility to access environment variables consistently on both server and client side.
 * In SSR mode, it supports reading variables injected into window.__ENV__ at runtime.
 */
export const getEnv = (key: string): string => {
  try {
    if (typeof window !== "undefined") {
      // Client-side: try runtime-injected env first, then fall back to build-time env
      return (
        (window as any).__ENV__?.[key] || (import.meta.env as any)?.[key] || ""
      );
    }

    // Server-side: Use process.env for reliable runtime access with dynamic keys.
    // We also check import.meta.env as a fallback for Astro-specific behavior.
    const processEnv = typeof process !== "undefined" ? process.env : {};
    return (processEnv?.[key] ||
      (import.meta.env as any)?.[key] ||
      "") as string;
  } catch (err) {
    console.error(`[getEnv Error] Failed to get key ${key}:`, err);
    return "";
  }
};
