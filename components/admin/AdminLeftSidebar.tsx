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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-700/50 p-6 flex flex-col justify-between animate-fade-in">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10 animate-fade-in-up">
          <div className="relative group">
            <div className="p-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300 shadow-lg">
              <Shield className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20" />
          </div>
          <h2 className="h2-bold bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">Admin</h2>
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
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg shadow-gray-900/50"
                      : "text-gray-300 hover:bg-gray-800/50"
                  } flex items-center justify-start gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden`}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" />
                  )}
                  <div className="relative z-10 flex items-center gap-4">
                    <link.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`} />
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