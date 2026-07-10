import { Link } from "@tanstack/react-router";
import cscLogo from "@/assets/csc_logo.webp";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className="flex items-center">
      <img
        src={cscLogo}
        alt="Chandrabhan Sharma College"
        className={`w-auto object-contain ${className || "h-10 sm:h-12"}`}
      />
    </Link>
  );
}
