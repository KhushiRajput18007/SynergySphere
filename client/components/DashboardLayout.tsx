import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "../lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
    maxContentWidth?: string;
}

export default function DashboardLayout({ children, className, maxContentWidth = "max-w-7xl" }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className={cn("mx-auto px-4 py-8", maxContentWidth, className)}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
