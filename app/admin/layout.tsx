import { ReactNode } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminLeftSidebar from "@/components/admin/AdminLeftSidebar";
import { Toaster } from "@/components/ui/toaster";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-light-850 dark:bg-dark-100">
      <AdminNavbar />
      <div className="flex">
        <AdminLeftSidebar />
        <main className="pl-64 w-full">
          <section className="mx-auto max-w-7xl p-6 pt-24">
            {children}
          </section>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout; 