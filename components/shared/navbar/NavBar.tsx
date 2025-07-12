import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import GlobalSearch from "../search/GlobalSearch";
import MobileNav from "./MobileNav";
import Theme from "./Theme";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";

const NavBar = () => {
  return (
    <nav className="fixed z-50 w-full animate-fade-in">
      <div className="absolute inset-0 h-full w-full">
        <Aurora
          colorStops={["#d1fae5", "#a7f3d0", "#6ee7b7"]}
          blend={1.5}
          amplitude={1.25}
          speed={0.75}
        />
      </div>
      <div className="absolute inset-0 h-full w-full bg-black/10 backdrop-blur-md dark:bg-black/30" />
      <div className="relative z-10 flex-between mx-auto w-full max-w-7xl px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/assets/images/site-logo.svg"
              width={36}
              height={36}
              alt="StackIt"
              className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <p className="h2-bold font-spaceGrotesk bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-green-300 max-sm:hidden">
              Stack<span className="text-emerald-500 dark:text-emerald-400">It</span>
            </p>
          </div>
        </Link>
        
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <GlobalSearch />
        </div>
        
        <div className="flex-between gap-5 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
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
          <div className="transition-transform duration-200 hover:scale-110">
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
