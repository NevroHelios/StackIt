import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import GlobalSearch from "../search/GlobalSearch";
import MobileNav from "./MobileNav";
import Theme from "./Theme";

const NavBar = () => {
  return (
    <nav className="fixed z-50 w-full border-b border-light-700 bg-light-800 p-4 shadow-sm dark:border-dark-400 dark:bg-dark-300 sm:p-6 sm:px-12">
      <div className="flex-between mx-auto w-full max-w-7xl gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/site-logo.svg"
            width={30}
            height={30}
            alt="DevFlow"
          />
          <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
            Dev<span className="text-primary-500">Overflow</span>
          </p>
        </Link>
        <GlobalSearch />
        <div className="flex-between gap-4">
          <Theme />
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
                variables: {
                  colorPrimary: "#3B82F6",
                },
              }}
            />
          </SignedIn>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
