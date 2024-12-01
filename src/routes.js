import { lazy } from "react";

export const publicRoutes = [
  {
    path: "/login",
    exact: true,
    element: lazy(() => import("./pages/auth/Login.jsx")),
  },
  {
    path: "/sign-up",
    exact: true,
    element: lazy(() => import("./pages/auth/SignUp.jsx")),
  },
];

export const protectedRoutes = [
  {
    path: "/",
    exact: true,
    element: lazy(() => import("./pages/index.jsx")),
  },
];
