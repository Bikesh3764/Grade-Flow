"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Home,
  GraduationCap, 
  RefreshCw,
  Target,
  FileBarChart,
  Calculator,
  TrendingUp
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { group: "Overview", items: [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "University Hub", href: "/university-hub", icon: GraduationCap },
  ]},
  { group: "Calculators", items: [
    { name: "CGPA Calculator", href: "/calculators/cgpa", icon: Calculator },
    { name: "SGPA Calculator", href: "/calculators/sgpa", icon: Calculator },
    { name: "GPA Converter", href: "/calculators/gpa", icon: RefreshCw },
  ]},
  { group: "Advanced Tools", items: [
    { name: "Target Predictor", href: "/calculators/target-predictor", icon: Target },
    { name: "Grade Simulator", href: "/calculators/grade-simulator", icon: TrendingUp },
    { name: "Backlog Impact", href: "/calculators/backlog-impact", icon: FileBarChart },
    { name: "Percentage Converter", href: "/converter", icon: RefreshCw },
  ]}
];

export function Sidebar({ isMobileOpen, onClose }: { isMobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={clsx(
        "w-72 h-screen border-r border-white/10 dark:border-white/5 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xl flex flex-col shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300",
        "fixed inset-y-0 left-0 lg:sticky lg:top-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="h-16 flex items-center px-6 border-b border-black/5 dark:border-white/5 shrink-0 bg-gradient-to-r from-transparent to-black/[0.02] dark:to-white/[0.02]">
        <div className="flex items-center gap-3 text-primary">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-sm">
            <GraduationCap size={22} strokeWidth={2.5} />
          </div>
          <span className="text-title-lg font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">GradeFlow</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-thin">
        {navItems.map((group, idx) => (
          <div key={idx} className="relative">
            <h3 className="px-4 text-[12px] font-extrabold text-gray-700 dark:text-gray-400 tracking-[0.2em] uppercase mb-3 flex items-center gap-4">
              {group.group}
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={clsx(
                      "flex items-center gap-3.5 px-4 py-3 rounded-xl text-body-sm transition-all duration-300 group relative overflow-hidden font-semibold",
                      isActive 
                        ? "text-primary font-bold shadow-sm ring-1 ring-primary/30 bg-primary/5" 
                        : "text-gray-800 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5" />
                    )}
                    <Icon 
                      size={18} 
                      className={clsx(
                        "transition-all duration-300 relative z-10", 
                        isActive 
                          ? "text-primary scale-110" 
                          : "text-gray-700 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-gray-100 group-hover:scale-110"
                      )} 
                      strokeWidth={isActive ? 2.5 : 2.5}
                    />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      </aside>
    </>
  );
}
