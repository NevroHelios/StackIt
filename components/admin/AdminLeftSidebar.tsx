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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-light-900 dark:bg-dark-200 p-6 flex flex-col justify-between border-r border-light-800 dark:border-dark-300">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-primary-500">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="h2-bold text-dark-100 dark:text-light-900">Admin</h2>
        </div>

        <nav className="flex flex-col gap-4">
          {adminLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 6) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.route}
                className={`${
                  isActive
                    ? "primary-gradient text-light-900"
                    : "text-dark-300 dark:text-light-700"
                } flex items-center justify-start gap-4 bg-transparent p-3 rounded-lg hover:bg-light-800 dark:hover:bg-dark-300 transition-colors`}
              >
                <link.icon className="h-5 w-5" />
                <p className="base-medium">{link.label}</p>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminLeftSidebar; 