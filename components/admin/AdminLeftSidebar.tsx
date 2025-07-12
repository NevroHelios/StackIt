"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Activity, 
  Settings, 
  Shield 
} from "lucide-react";

const adminLinks = [
  {
    icon: BarChart3,
    route: "/admin",
    label: "Dashboard",
  },
  {
    icon: Users,
    route: "/admin/users",
    label: "User Management",
  },
  {
    icon: MessageSquare,
    route: "/admin/answers",
    label: "Answer Management",
  },
  {
    icon: Activity,
    route: "/admin/activity",
    label: "Recent Activity",
  },
  {
    icon: Settings,
    route: "/admin/settings",
    label: "Settings",
  },
];

const AdminLeftSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-morphism-emerald border-r border-emerald-200/30 dark:border-emerald-700/30 p-6 flex flex-col justify-between animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-10 animate-fade-in-up">
          <div className="relative group">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 group-hover:from-emerald-600 group-hover:to-green-600 transition-all duration-300 shadow-lg">
              <Shield className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
          </div>
          <h2 className="h2-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-green-300">Admin</h2>
        </div>

        <nav className="flex flex-col gap-3">
          {adminLinks.map((link, index) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 6) ||
              pathname === link.route;

            return (
              <div
                key={link.route}
                className="animate-fade-in-up"
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                <Link
                  href={link.route}
                  className={`${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50"
                      : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30"
                  } flex items-center justify-start gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden`}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" />
                  )}
                  <div className="relative z-10 flex items-center gap-4">
                    <link.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                    <p className={`base-medium transition-colors duration-300 ${isActive ? 'text-white font-semibold' : ''}`}>{link.label}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminLeftSidebar; 