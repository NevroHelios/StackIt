import AnswerManagement from "@/components/admin/AnswerManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Answer Management | Admin",
};

const AnswerManagementPage = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Answer Management</h1>
      <div className="mt-8">
        <AnswerManagement />
      </div>
    </div>
  );
};

export default AnswerManagementPage; 