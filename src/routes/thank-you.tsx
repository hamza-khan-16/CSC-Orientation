import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Check } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Squiggle, Star } from "@/components/site/Doodles";

export const Route = createFileRoute("/thank-you")({
  component: ThankYou,
  head: () => ({
    meta: [
      { title: "Thank you · CSC Orientation" },
      {
        name: "description",
        content: "Your CSC orientation feedback has been received. Explore the college next.",
      },
    ],
  }),
});

function ThankYou() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary shadow-[0_20px_40px_-20px_oklch(0.735_0.171_55/0.7)]"
        >
          <Check className="h-12 w-12 text-primary-foreground" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GraduationCap className="mx-auto mt-6 h-10 w-10 text-secondary" />
          <h1 className="mt-4 font-display text-7xl text-secondary sm:text-8xl">Thank You!</h1>
          <Squiggle className="mx-auto mt-1 h-6 w-64 text-primary" />
          <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">
            Your feedback has been added to the notebook. We read every note — it shapes everything
            from lab tools to the way we teach.
          </p>
        </motion.div>

        {/* confetti-ish scatter */}
        {[..."✦✎★❋✿"].map((c, i) => (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: [0, -18, 0], opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 3, repeat: Infinity }}
            className="absolute text-2xl text-primary/70"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 12}%` }}
          >
            {c}
          </motion.span>
        ))}

        <Link
          to="/explore"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground btn-magnetic"
        >
          Explore CSC <ArrowRight className="h-5 w-5" />
        </Link>

        <div className="mt-14 flex justify-center gap-3 text-primary/60">
          <Star className="h-5 w-5" />
          <Star className="h-4 w-4" />
          <Star className="h-5 w-5" />
        </div>
      </section>
      <Footer />
    </div>
  );
}
