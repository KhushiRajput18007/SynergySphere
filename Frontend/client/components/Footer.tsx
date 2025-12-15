import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterCol title="Product" links={["Overview", "Features", "Pricing"]} />
          <FooterCol title="Company" links={["About", "Careers", "Contact"]} />
          <FooterCol title="Resources" links={["Blog", "Help Center", "Documentation"]} />
          <FooterCol title="Legal" links={["Privacy Policy", "Terms of Service"]} />
        </div>

        <div className="my-10 border-y border-white/10 py-8 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm">
              <span className="h-2 w-2 rounded bg-white" />
            </span>
            <span className="font-semibold text-white">SynergySphere</span>
          </div>
          <div className="text-sm text-slate-400">The central nervous system for your team.</div>
          <div className="mx-auto mt-4 flex max-w-md items-center gap-2">
            <Input placeholder="Enter your email address" className="h-9 bg-slate-800 text-slate-100 placeholder:text-slate-400" />
            <Button className="h-9">Subscribe</Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <div>Copyright © {new Date().getFullYear()} SynergySphere. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Github" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-slate-400">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-slate-200">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
