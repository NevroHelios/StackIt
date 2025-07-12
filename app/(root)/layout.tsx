import NavBar from "@/components/shared/navbar/NavBar";
import LeftSideBar from "@/components/shared/sidebar/LeftSideBar";
import RightSideBar from "@/components/shared/sidebar/RightSideBar";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative bg-background">
      <NavBar />
      <div className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen flex-1 flex-col px-4 pb-6 pt-36 max-md:pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-14">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
