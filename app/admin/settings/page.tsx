import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Admin",
};

const SettingsPage = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Settings</h1>
      <p className="text-dark-400 dark:text-light-500 mt-4">
        Admin settings will be available here in a future update.
      </p>
    </div>
  );
};

export default SettingsPage; 