import DashboardLayout from "../components/DashboardLayout";

export default function Placeholder({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <main className="rounded-2xl border border-dashed p-20 text-center flex flex-col items-center justify-center space-y-4 bg-muted/5 shadow-inner">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground font-medium">This module is prepared for construction.</p>
        </div>
        <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
          What should we build here? Just describe the functionality you need for <strong>{title}</strong> and I'll implement it with the same premium industrial design.
        </p>
      </main>
    </DashboardLayout>
  );
}
