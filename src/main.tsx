import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "./components/custom/Header.tsx";
import Loader from "./components/custom/Loader.tsx";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

const MyTrips = lazy(() => import("./my-trips/index.tsx"));
const ViewTrip = lazy(() => import("./view-trip/[tripId]/index.tsx"));
const CreateTrip = lazy(() => import("./create-trip/index.tsx"));
const App = lazy(() => import("./App.tsx"));

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    ),
  },
  {
    path: "/create-trip",
    element: (
      <Suspense fallback={<Loader />}>
        <CreateTrip />
      </Suspense>
    ),
  },
  {
    path: "/view-trip/:tripId",
    element: (
      <Suspense fallback={<Loader />}>
        <ViewTrip />
      </Suspense>
    ),
  },
  {
    path: "/my-trips",
    element: (
      <Suspense fallback={<Loader />}>
        <MyTrips />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_APP_CLIENT_ID}`}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
