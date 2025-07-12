"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Shield, Home, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Theme from "@/components/shared/navbar/Theme";
import { useRouter } from "next/navigation";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";

const AdminNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 animate-fade-in">
      <div className="absolute inset-0 h-full w-full">
        <Aurora
          colorStops={["#d1fae5", "#a7f3d0", "#6ee7b7"]}
          blend={1.5}
          amplitude={1.25}
          speed={0.75}
        />
      </div>
      <div className="absolute inset-0 h-full w-full bg-black/10 backdrop-blur-md dark:bg-black/30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 animate-fade-in-up">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 group-hover:from-emerald-600 group-hover:to-green-600 transition-all duration-300 shadow-lg group-hover:shadow-emerald-200/50">
                  <Shield className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-green-300">
                  Admin Panel
                </h1>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/50 dark:to-green-900/50 dark:text-emerald-200 animate-pulse border-emerald-200/50">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300 transition-all duration-200 hover:scale-105"
            >
              <Home className="h-4 w-4 mr-2" />
              Main Site
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300 transition-all duration-200 hover:scale-105"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="transition-transform duration-200 hover:scale-110">
              <Theme />
            </div>
            <SignedIn>
              <div className="relative group">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 transition-all duration-300 hover:scale-110 rounded-full border-2 border-emerald-200/50 hover:border-emerald-400/80 shadow-lg hover:shadow-emerald-200/50",
                    },
                    variables: {
                      colorPrimary: "#10b981",
                    },
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 