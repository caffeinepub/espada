import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile, useIsAdmin } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  LogIn,
  LogOut,
  Menu,
  Radio,
  Shield,
  Swords,
  User,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EspadaBadge } from "./EspadaBadge";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scrims", label: "Scrims", icon: Swords },
  { to: "/streams", label: "Live Streams", icon: Radio },
  { to: "/teams", label: "Teams", icon: Users },
  { to: "/profile", label: "My Profile", icon: User },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useCallerProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!identity;
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass-card border-b border-[oklch(0.3_0.06_265/0.3)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-3 group"
          >
            <img
              src="/assets/generated/espada-logo-transparent.dim_400x400.png"
              alt="ESPADA"
              className="w-10 h-10 object-contain"
            />
            <span className="font-display font-bold text-xl tracking-wider gradient-text">
              ESPADA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`nav.${label.toLowerCase().replace(" ", "_")}.link`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10 neon-glow-blue"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/admin"
                    ? "text-[oklch(0.78_0.18_65)] bg-[oklch(0.78_0.18_65/0.1)]"
                    : "text-[oklch(0.6_0.12_65)] hover:text-[oklch(0.78_0.18_65)] hover:bg-[oklch(0.78_0.18_65/0.05)]"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && profile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  {profile.username}
                </span>
                {isAdmin && <EspadaBadge type="admin" size={20} />}
              </div>
            )}
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                data-ocid="nav.logout.button"
                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
                className="bg-primary text-primary-foreground neon-glow-blue font-display font-semibold tracking-wide"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}

            {/* Mobile menu toggle */}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-foreground/80 hover:text-foreground p-2"
            onClick={() => setMobileOpen((v) => !v)}
            data-ocid="nav.menu.toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-[oklch(0.3_0.06_265/0.3)]"
            >
              <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      data-ocid={`nav.mobile.${label.toLowerCase().replace(" ", "_")}.link`}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="nav.mobile.admin.link"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-[oklch(0.6_0.12_65)] hover:text-[oklch(0.78_0.18_65)]"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <div className="pt-2 border-t border-[oklch(0.3_0.06_265/0.2)] mt-1">
                  {isLoggedIn ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        clear();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.mobile.logout.button"
                      className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Logout
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        login();
                        setMobileOpen(false);
                      }}
                      disabled={isLoggingIn}
                      data-ocid="nav.mobile.login.button"
                      className="w-full bg-primary text-primary-foreground neon-glow-blue"
                    >
                      <LogIn className="w-4 h-4 mr-1.5" />
                      {isLoggingIn ? "Connecting..." : "Login"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-[oklch(0.3_0.06_265/0.3)] py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/assets/generated/espada-logo-transparent.dim_400x400.png"
              alt="ESPADA"
              className="w-8 h-8 object-contain opacity-60"
            />
            <span className="font-display font-bold text-lg gradient-text">
              ESPADA
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Your Daily eSports Arena — Scrims, Streams & Teams
          </p>
          <p className="text-muted-foreground/50 text-xs mt-3">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
