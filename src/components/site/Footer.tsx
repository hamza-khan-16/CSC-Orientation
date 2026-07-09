import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24">
      <svg viewBox="0 0 1200 40" className="block w-full text-primary" preserveAspectRatio="none">
        <path d="M0,20 C120,4 240,36 360,20 S600,4 720,20 960,36 1080,20 1200,4 1200,20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" />
      </svg>
      <div className="border-t border-border/70 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Department of Information Technology — where curious students become
              engineers, researchers and founders.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Youtube].map((I, i) => (
                <a key={i} href="https://www.instagram.com/chandrabhansharma.college?igsh=cnNjeWN3aWhhNHA=" aria-label="social" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white hover:border-primary hover:text-primary">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-2xl text-secondary">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/feedback" className="hover:text-primary">Feedback</Link></li>
              <li><Link to="/explore" className="hover:text-primary">Explore IT</Link></li>
              <li><Link to="/explore" hash="faculty" className="hover:text-primary">Faculty</Link></li>
              <li><Link to="/explore" hash="labs" className="hover:text-primary">Labs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-2xl text-secondary">Get in touch</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />Powai-Vihar, Powai, Mumbai — 400076</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />itdept@cschcollege.edu.in</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />+91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Chandrabhan Sharma College · IT Department. Handcrafted with ✎.
        </div>
      </div>
    </footer>
  );
}