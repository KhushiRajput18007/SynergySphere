// Suppress benign ResizeObserver loop warnings seen in Chrome during animated layout changes.
// This prevents noisy console errors without affecting actual error reporting.
if (typeof window !== "undefined") {
  const shouldIgnore = (msg?: string) =>
    typeof msg === "string" &&
    (msg.includes("ResizeObserver loop limit exceeded") ||
      msg.includes("ResizeObserver loop completed with undelivered notifications"));

  window.addEventListener(
    "error",
    (event: ErrorEvent) => {
      if (shouldIgnore(event.message)) {
        event.stopImmediatePropagation();
      }
    },
    { capture: true },
  );

  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      const reason = (event as any).reason;
      const message = typeof reason === "string" ? reason : reason?.message;
      if (shouldIgnore(message)) {
        event.stopImmediatePropagation();
      }
    },
    { capture: true },
  );
}
