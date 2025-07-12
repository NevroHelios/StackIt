import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import GlobalSearch from "../search/GlobalSearch";
import MobileNav from "./MobileNav";
import Theme from "./Theme";

const NavBar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-3 p-4 shadow-light-300 dark:shadow-none sm:gap-5 sm:p-6 sm:px-8 lg:px-12">
      <Link href="/" className="flex items-center gap-1 ">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="DevFlow"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500"> Overflow</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-3 sm:gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 sm:h-10 sm:w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default NavBar;
