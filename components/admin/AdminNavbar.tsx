"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Shield, Home, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Theme from "@/components/shared/navbar/Theme";
import { useRouter } from "next/navigation";

const AdminNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse">
              Admin
            </Badge>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Main Site
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Theme />
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 transition-transform hover:scale-110",
                  },
                  variables: {
                    colorPrimary: "#3b82f6",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 