import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ScrimsPage } from "./pages/ScrimsPage";
import { StreamsPage } from "./pages/StreamsPage";
import { TeamsPage } from "./pages/TeamsPage";

// ── Root Route ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "glass-card border-border font-body text-foreground",
            title: "font-display font-semibold",
          },
        }}
      />
    </Layout>
  ),
});

// ── Child Routes ─────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const scrimsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scrims",
  component: ScrimsPage,
});

const streamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/streams",
  component: StreamsPage,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teams",
  component: TeamsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/" />,
});

// ── Route Tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  scrimsRoute,
  streamsRoute,
  teamsRoute,
  profileRoute,
  adminRoute,
  catchAllRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
