import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { publicRoutes, protectedRoutes } from "./routes";
import PublicLayout from "./layout/PublicLayout";
// import ProtectedLayout from "./layout/ProtectedLayout";
import Home from "./pages";
import ProtectedLayout from "./layout/ProtectedLayout";
import Loader from "./components/Loader";

const Router = () => {
  return (
    <>
      <Routes>
        {/** Public Routes **/}
        <Route element={<PublicLayout />}>
          {publicRoutes.map((route, i) => {
            return (
              <Route
                key={`public-${i}`}
                path={route.path}
                element={
                  <Suspense fallback={<Loader />}>
                    <route.element />
                  </Suspense>
                }
              />
            );
          })}
        </Route>

        {/** Protected Routes **/}
        <Route path="/" element={<ProtectedLayout />}>
          {protectedRoutes.map((route, i) => {
            return (
              <Route
                key={`protected-${i}`}
                path={route.path}
                element={
                  <Suspense fallback={<Loader />}>
                    <route.element />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
};

export default Router;
