import { useEffect, useState } from "react";
import { Switch } from "../components/ui/switch";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="text-sm">Dark mode</span>
      <Switch checked={isDark} onCheckedChange={setIsDark} />
    </div>
  );
}
