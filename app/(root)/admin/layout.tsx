import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <AdminNavbar />
      <main className="pt-16">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AdminLayout; 