import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Users, FlaskConical, Rocket, Star as StarIcon, Maximize2, X } from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Star, Squiggle, Arrow, Bulb, Plane, Scribble } from "@/components/site/Doodles";
import labComputer from "@/assets/lab-computer.jpg";
import labAI from "@/assets/lab-ai.jpg";
import labNetwork from "@/assets/lab-network.jpg";
import students from "@/assets/students.jpg";
import campus from "@/assets/campus.jpg";

export const Route = createFileRoute("/")({ component: Index });

const FALLBACK_SLIDES = [
  { src: labComputer, label: "Computer Lab" },
  { src: labAI, label: "AI Lab" },
  { src: labNetwork, label: "Networking Lab" },
  { src: students, label: "Students" },
  { src: campus, label: "Campus" },
];

function Index() {
  const [i, setI] = useState(0);
  const [slides, setSlides] = useState<{ src: string; label: string }[]>(FALLBACK_SLIDES);

  // Load slideshow images from Supabase, fall back to local assets
  useEffect(() => {
    (async () => {
      const { data } = await supabase.storage.from("slideshow").list("", { sortBy: { column: "created_at", order: "asc" } });
      const items = (data ?? []).filter(f => !f.name.startsWith("."));
      if (items.length > 0) {
        setSlides(items.map(f => ({
          src: supabase.storage.from("slideshow").getPublicUrl(f.name).data.publicUrl,
          label: f.name.replace(/[-_]/g, " ").replace(/\.[^.]+$/, ""),
        })));
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-24 sm:pt-16">
        {/* floating doodles */}
        <Star className="floaty absolute left-4 top-24 h-8 w-8 text-primary/60" />
        <Bulb className="floaty absolute right-10 top-40 h-9 w-9 text-secondary/60" style={{ animationDelay: "1s" } as React.CSSProperties} />
        <Plane className="floaty absolute left-1/2 top-6 h-10 w-10 -translate-x-1/2 text-secondary/50" style={{ animationDelay: "2s" } as React.CSSProperties} />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative">
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-secondary/70"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Orientation 2026 · Batch of ’30
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-5 font-display text-6xl leading-[0.95] text-secondary sm:text-7xl md:text-8xl"
            >
              Welcome to <br />
              <span className="relative inline-block">
                <span className="ink-underline px-1 text-primary">IT Department</span>
              </span><br />
              Orientation
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground"
            >
              Your voice shapes the way we teach, the labs we build and the community we
              grow. Take two minutes to share how your first day felt.
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/feedback"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground btn-magnetic"
              >
                Start Feedback
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link to="/explore" className="text-sm font-medium text-secondary/80 underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">
                or peek inside the department →
              </Link>
            </div>

            <Arrow className="absolute -bottom-16 left-8 hidden h-16 w-40 text-secondary/50 sm:block" />
          </div>

          {/* Polaroid slider */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative rotate-2">
              <span className="tape left-1/2 -top-3 -translate-x-1/2 rotate-[-4deg]" />
              <div className="paper-card p-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={i}
                      src={slides[i].src}
                      alt={slides[i].label}
                      width={1280} height={960}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                </div>
                <p className="mt-3 text-center font-display text-2xl text-secondary">{slides[i].label}</p>
                <div className="mt-2 flex justify-center gap-1.5">
                  {slides.map((_, k) => (
                    <button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-secondary/25"}`} aria-label={`slide ${k + 1}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* mini card */}
            <div className="absolute -bottom-8 -left-6 hidden rotate-[-6deg] sm:block">
              <div className="sticky-note w-40 px-4 py-3 text-secondary">
                <p className="font-display text-lg leading-tight">Building futures with</p>
                <p className="font-display text-lg leading-tight text-primary">code & creativity ✎</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR + WHY */}
      <QRSection />

            {/* Big CTA */}
      <section className="mx-auto mt-24 max-w-5xl px-6 text-center">
        <Squiggle className="mx-auto h-6 w-40 text-primary" />
        <h2 className="mt-4 font-display text-5xl leading-tight text-secondary sm:text-6xl">
          Ready to leave your mark on the notebook?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Ten quick steps. Handwritten questions, tap-to-answer style. Your notes stay
          anonymous unless you sign them.
        </p>
        <Link
          to="/feedback"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground btn-magnetic"
        >
          Open the notebook <ArrowRight className="h-4 w-4" />
        </Link>
        <div className="mt-8 flex justify-center">
          <Scribble className="h-6 w-64 text-primary/60" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const FEEDBACK_URL = "https://csc-orientation.vercel.app/feedback";

function QRSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(FEEDBACK_URL, {
      width: 160,
      margin: 1,
      color: { dark: "#2D2A22", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, []);

  useEffect(() => {
    if (showModal && modalCanvasRef.current) {
      QRCode.toCanvas(modalCanvasRef.current, FEEDBACK_URL, {
        width: 320,
        margin: 2,
        color: { dark: "#2D2A22", light: "#FFFFFF" },
      });
    }
  }, [showModal]);

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mb-4 text-center font-display text-2xl text-secondary">Scan to give feedback</p>
            <canvas ref={modalCanvasRef} className="rounded-xl" />
            <p className="mt-3 text-center text-xs text-muted-foreground break-all max-w-xs">{FEEDBACK_URL}</p>
          </motion.div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 rounded-3xl paper-card p-8 md:p-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-display text-xl text-primary">Scan · Share · Shape</p>
            <h2 className="mt-1 font-display text-4xl text-secondary sm:text-5xl">Point your camera, share your voice.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Every sticky note on this wall started as a scan. Aim your phone at the code and
              you'll land on the feedback notebook.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <div className="relative rounded-2xl border border-dashed border-primary/60 bg-white p-4">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Feedback QR Code" className="h-32 w-32 rounded-lg" />
                ) : (
                  <div className="h-32 w-32 animate-pulse rounded-lg bg-secondary/10" />
                )}
                <div className="absolute inset-4 rounded-lg ring-2 ring-primary/30 pointer-events-none" />
              </div>
              <Arrow className="h-16 w-24 text-secondary/60" />
              <div className="relative">
                <div className="h-40 w-24 rounded-2xl border-4 border-secondary bg-white shadow-lg">
                  <div className="mx-auto mt-2 h-1 w-8 rounded bg-secondary/60" />
                  <div className="mx-auto mt-3 grid h-24 w-16 place-items-center rounded-md bg-muted overflow-hidden">
                    {qrDataUrl && <img src={qrDataUrl} alt="QR" className="h-full w-full object-cover" />}
                  </div>
                </div>
                <Star className="floaty absolute -right-6 -top-4 h-6 w-6 text-primary" />
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white px-5 py-2.5 text-sm font-medium text-secondary hover:bg-primary/5 transition"
            >
              <Maximize2 className="h-4 w-4 text-primary" /> View QR
            </button>
          </div>

          <div>
            <h3 className="font-display text-4xl text-secondary sm:text-5xl">Why your feedback matters</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, title: "Better teaching", body: "Real notes from you tune how faculty run every session.", color: "#FFF4B8", rot: "-2deg" },
                { icon: FlaskConical, title: "Sharper labs", body: "We upgrade the tools and stacks students actually use.", color: "#CDEBFF", rot: "1.5deg" },
                { icon: Rocket, title: "Room to grow", body: "New clubs, hackathons and mentors — sparked by your ideas.", color: "#FFD6C0", rot: "-1deg" },
                { icon: StarIcon, title: "Your experience", body: "The little details that make orientation feel unforgettable.", color: "#D8F5C4", rot: "2deg" },
              ].map(({ icon: I, title, body, color, rot }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -6, rotate: 0 }}
                  style={{ background: color, transform: `rotate(${rot})` }}
                  className="relative rounded-md p-5 shadow-[2px_10px_24px_-12px_rgba(0,0,0,0.25)]"
                >
                  <span className="tape left-1/2 -top-3 -translate-x-1/2 rotate-[-6deg]" />
                  <I className="h-6 w-6 text-secondary" />
                  <h4 className="mt-3 font-display text-2xl text-secondary">{title}</h4>
                  <p className="mt-1 text-sm text-secondary/70">{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
