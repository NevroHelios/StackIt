"use client";

import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedOut, useAuth } from "@clerk/nextjs";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";

const LeftSideBar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-emerald-200/30 p-6 pt-36 shadow-sm dark:border-emerald-700/30 max-sm:hidden lg:w-[266px] animate-fade-in">
      <div className="absolute inset-0 h-full w-full">
        <Aurora
          colorStops={["#d1fae5", "#a7f3d0", "#6ee7b7"]}
          blend={1.5}
          amplitude={1.25}
          speed={0.75}
        />
      </div>
      <div className="absolute inset-0 h-full w-full bg-black/10 backdrop-blur-md dark:bg-black/30" />
      <div className="relative z-10 flex flex-1 flex-col gap-2">
        {sidebarLinks.map((item, index) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          if (item.route === "/profile") {
            if (userId) {
              item.route = `${item.route}/${userId}`;
            } else {
              return null;
            }
          }

          return (
            <div
              key={item.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <Link
                href={item.route}
                className={`${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 scale-105"
                    : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30"
                } flex items-center justify-start gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden`}
              >
                {/* Hover background effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-green-50/30 dark:from-emerald-900/20 dark:to-green-900/10 opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-xl" />
                )}
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={item.imgURL}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={`${isActive ? "" : "invert-colors"} transition-all duration-300 group-hover:scale-110 ${
                        isActive ? "drop-shadow-lg" : "group-hover:drop-shadow-md"
                      }`}
                    />
                    {/* Glow effect for active items */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-white/30 blur-sm animate-pulse" />
                    )}
                  </div>
                  <p
                    className={`${
                      isActive ? "base-bold text-white" : "base-medium group-hover:font-semibold"
                    } max-lg:hidden transition-all duration-300`}
                  >
                    {item.label}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-1 h-8 bg-white/50 rounded-full animate-pulse" />
                )}
              </Link>
            </div>
          );
        })}
      </div>
      
      <SignedOut>
        <div className="relative z-10 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <Link href="/sign-in">
            <Button className="small-medium w-full rounded-xl px-4 py-3 shadow-none bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/50 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out" />
              <div className="relative z-10 flex items-center gap-2">
                <Image
                  src="/assets/icons/account.svg"
                  alt="login"
                  width={20}
                  height={20}
                  className="invert transition-transform duration-300 group-hover:scale-110 lg:hidden"
                />
                <span className="max-lg:hidden font-semibold">
                  Log In
                </span>
              </div>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium w-full rounded-xl px-4 py-3 shadow-none bg-emerald-50/50 dark:bg-emerald-800/30 border-2 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/50 hover:border-emerald-300/70 dark:hover:border-emerald-600/70 transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-green-50/20 dark:from-emerald-900/20 dark:to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-2">
                <Image
                  src="/assets/icons/sign-up.svg"
                  alt="sign up"
                  width={20}
                  height={20}
                  className="invert-colors transition-transform duration-300 group-hover:scale-110 lg:hidden"
                />
                <span className="max-lg:hidden font-semibold">Sign up</span>
              </div>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSideBar;
