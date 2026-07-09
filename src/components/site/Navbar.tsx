import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/feedback", label: "Feedback" },
  { to: "/explore", label: "Explore CSC" },
  { to: "/explore", label: "Faculty", hash: "faculty" },
  { to: "/explore", label: "Labs", hash: "labs" },
  { to: "/explore", label: "Projects", hash: "projects" },
  { to: "/explore", label: "Contact", hash: "contact" },
] as const;

type NavLink = (typeof links)[number];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleNav = (l: NavLink, closeMenu = false) => {
    if (closeMenu) setOpen(false);
    const hash = "hash" in l ? l.hash : undefined;
    if (hash) {
      if (path === l.to) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        navigate({ to: l.to }).then(() => {
          setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
        });
      }
    } else {
      navigate({ to: l.to });
    }
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between gap-3 rounded-2xl glass-card px-3 py-2 sm:px-5 sm:py-3">
        {/* Logo — shrinks gracefully */}
        <div className="flex-shrink-0">
          <Logo className="h-9 sm:h-11" />
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((l, i) => {
            const hash = "hash" in l ? l.hash : undefined;
            const active = path === l.to && !hash;
            return (
              <button
                key={i}
                onClick={() => handleNav(l)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap
                  ${active ? "text-primary bg-primary/8" : "text-secondary/75 hover:text-primary hover:bg-primary/6"}`}
              >
                {l.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* CTA — hidden on very small screens */}
          <Link
            to="/feedback"
            className="hidden rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground btn-magnetic sm:inline-flex md:px-5 md:py-2.5 md:text-sm"
          >
            <span className="hidden md:inline">Start Feedback</span>
            <span className="md:hidden">Feedback</span>
          </Link>

          {/* Hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="xl:hidden rounded-xl border border-border bg-white/70 p-2 text-secondary shadow-sm transition hover:bg-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="mx-3 mt-2 overflow-hidden rounded-2xl paper-card shadow-lg xl:hidden">
          <div className="p-3">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {links.map((l, i) => {
                const hash = "hash" in l ? l.hash : undefined;
                const active = path === l.to && !hash;
                return (
                  <button
                    key={i}
                    onClick={() => handleNav(l, true)}
                    className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer
                      ${active ? "bg-primary/10 text-primary" : "text-secondary hover:bg-muted"}`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* CTA inside mobile menu */}
            <div className="mt-3 border-t border-border pt-3">
              <Link
                to="/feedback"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Start Feedback <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
