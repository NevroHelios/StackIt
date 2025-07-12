import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <SignIn
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary:
            "primary-gradient !text-light-900 h-11 w-full rounded-lg",
          footerActionLink: "text-primary-500 hover:text-primary-500",
          formFieldInput:
            "rounded-lg border-light-700 dark:border-dark-400 dark:bg-dark-300",
        },
      }}
    />
  );
}