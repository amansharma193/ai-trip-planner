import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import CreateTrip from "./create-trip/index.tsx";
import Header from "./components/custom/Header.tsx";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import ViewTrip from "./view-trip/[tripId]/index.tsx";
// import MyTrips from "./my-trips/index.tsx";

const MyTrips = lazy(() => import("./my-trips/index.tsx"));
const ViewTrip = lazy(() => import("./view-trip/[tripId]/index.tsx"));
const CreateTrip = lazy(() => import("./create-trip/index.tsx"));
const App = lazy(() => import("./App.tsx"));

const router = createBrowserRouter([
  { path: "/", element: (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  ) },
  { path: "/create-trip", element: (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTrip />
    </Suspense>
  ) },
  { path: "/view-trip/:tripId", element: (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewTrip />
    </Suspense>
  ) },
  { path: "/my-trips", element: (
    <Suspense fallback={<div>Loading...</div>}>
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
