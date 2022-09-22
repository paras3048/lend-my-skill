export const BACKEND_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "http://localhost:5000";
export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

export const DASHBOARD_SIDEBAR_ROUTES = [
  "/dashboard",
  "/dashboard/notifications",
  "/dashboard/post",
  "/dashboard/profile/settings",
  "/orders",
  "/chat"
];
