import { authMiddleware } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/jobs",
    "/ask-question",
  ],
  ignoredRoutes: ["/api/webhook", "/api/chatgpt"],
  beforeAuth: (req: NextRequest) => {
    // Handle forwarded headers for tunnels
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto");

    if (forwardedHost && forwardedProto) {
      // Trust the forwarded headers
      req.headers.set("host", forwardedHost);
      req.headers.set("x-forwarded-proto", forwardedProto);
    }
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
