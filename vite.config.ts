import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    minify: "terser",
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings for clean build
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }
        if (warning.message.includes('use client')) {
          return;
        }
        if (warning.message.includes('chunk size')) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ["react", "react-dom"],
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-collection",
            "@radix-ui/react-dismissable-layer",
            "@radix-ui/react-portal",
            "@radix-ui/react-popper",
            "@radix-ui/react-presence",
            "@radix-ui/react-focus-guards",
            "@radix-ui/react-focus-scope",
            "@radix-ui/react-roving-focus"
          ],
          tanstack: ["@tanstack/react-query"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          router: ["react-router-dom"],
          utils: ["date-fns", "zod", "clsx", "tailwind-merge"],
          ui: [
            "framer-motion",
            "lucide-react",
            "sonner",
            "next-themes",
            "cmdk",
            "vaul",
            "react-day-picker",
            "recharts",
            "react-resizable-panels",
            "embla-carousel-react",
            "input-otp"
          ],
          forms: ["react-hook-form", "@hookform/resolvers"]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared")
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      }
    }
  }
});
