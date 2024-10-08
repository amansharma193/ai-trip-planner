import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/custom/Header.tsx";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Loader from "./components/custom/Loader.tsx";

const MyTrips = lazy(() => import("./my-trips/index.tsx"));
const ViewTrip = lazy(() => import("./view-trip/[tripId]/index.tsx"));
const CreateTrip = lazy(() => import("./create-trip/index.tsx"));
const App = lazy(() => import("./App.tsx"));

const router = createBrowserRouter([
  { path: "/", element: (
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  ) },
  { path: "/create-trip", element: (
    <Suspense fallback={<Loader />}>
      <CreateTrip />
    </Suspense>
  ) },
  { path: "/view-trip/:tripId", element: (
    <Suspense fallback={<Loader />}>
      <ViewTrip />
    </Suspense>
  ) },
  { path: "/my-trips", element: (
    <Suspense fallback={<Loader />}>
      <MyTrips />
    </Suspense>
  ) },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_APP_CLIENT_ID}`}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
