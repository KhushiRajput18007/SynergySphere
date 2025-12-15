import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function FooterSubscribe() {
  return (
    <div className="mt-6 rounded-xl border bg-gradient-to-b from-background to-muted/40 p-5 text-center">
      <div className="mx-auto mb-3 flex items-center justify-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm">
          <span className="h-2 w-2 rounded bg-white" />
        </span>
        <span className="font-semibold">SynergySphere</span>
      </div>
      <div className="text-xs text-muted-foreground">The central nervous system for your team.</div>
      <div className="mx-auto mt-4 flex max-w-md items-center gap-2">
        <Input placeholder="Enter your email address" className="h-9" />
        <Button className="h-9">Subscribe</Button>
      </div>
    </div>
  );
}
