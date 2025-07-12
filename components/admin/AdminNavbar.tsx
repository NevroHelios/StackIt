"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Shield, Home, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const AdminNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 animate-fade-in">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 animate-fade-in-up">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300 shadow-lg group-hover:shadow-gray-700/50">
                  <Shield className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 animate-pulse border-gray-600/50">
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
              className="hover:bg-gray-800/50 text-gray-300 transition-all duration-200 hover:scale-105"
            >
              <Home className="h-4 w-4 mr-2" />
              Main Site
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="hover:bg-gray-800/50 text-gray-300 transition-all duration-200 hover:scale-105"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <SignedIn>
              <div className="relative group">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 transition-all duration-300 hover:scale-110 rounded-full border-2 border-gray-600/50 hover:border-gray-500/80 shadow-lg hover:shadow-gray-700/50",
                    },
                    variables: {
                      colorPrimary: "#9CA3AF",
                    },
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 