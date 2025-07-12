import UserManagement from "@/components/admin/UserManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Admin",
};

const UserManagementPage = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">User Management</h1>
      <div className="mt-8">
        <UserManagement />
      </div>
    </div>
  );
};

export default UserManagementPage; 