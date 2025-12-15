import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr] gap-6 px-4 py-6">
        <Sidebar />
        <main className="rounded-lg border p-10">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">This section is ready to be filled. Tell me what to show here and I’ll build it.</p>
        </main>
      </div>
    </div>
  );
}
