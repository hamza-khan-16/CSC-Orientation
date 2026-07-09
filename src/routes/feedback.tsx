import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Star as StarIcon,
  ThumbsUp,
  Smile,
  Meh,
  Frown,
  PartyPopper,
  Loader2,
  Phone,
  GraduationCap,
} from "lucide-react";
import { supabase, COURSES } from "@/lib/supabase";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Squiggle } from "@/components/site/Doodles";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
  head: () => ({
    meta: [
      { title: "Orientation Feedback · CSC" },
      {
        name: "description",
        content: "Share your CSC orientation experience in nine quick handwritten steps.",
      },
    ],
  }),
});

type Data = {
  name: string;
  phone: string;
  course: string;
  orientation: number;
  faculty: number;
  lab: string;
  facilities: number;
  suggestions: string;
  recommend: "yes" | "maybe" | "no" | "";
};
const initial: Data = {
  name: "",
  phone: "",
  course: "",
  orientation: 0,
  faculty: 0,
  lab: "",
  facilities: 5,
  suggestions: "",
  recommend: "",
};

const steps = [
  "Your name",
  "Phone number",
  "Your course",
  "Rate orientation",
  "Rate faculty",
  "Lab experience",
  "Campus facilities",
  "Suggestions",
  "Recommend us?",
];

function FeedbackPage() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [data, setData] = useState<Data>(initial);
  const [submitting, setSubmitting] = useState(false);
  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  const handleSubmit = async () => {
    if (!canNext()) return;
    setSubmitting(true);
    try {
      await supabase.from("feedback").insert([
        {
          name: data.name || "Anonymous",
          phone: data.phone || "",
          course: data.course || "",
          orientation: data.orientation,
          faculty: data.faculty,
          lab: data.lab,
          facilities: data.facilities,
          suggestions: data.suggestions,
          recommend: data.recommend,
        },
      ]);
    } catch (_) {
      // Still navigate even if save fails
    } finally {
      setSubmitting(false);
      nav({ to: "/thank-you" });
    }
  };

  const canNext = () => {
    switch (i) {
      case 0:
        return data.name.trim().length > 1;
      case 1:
        return /^[6-9]\d{9}$/.test(data.phone.trim());
      case 2:
        return data.course !== "";
      case 3:
        return data.orientation > 0;
      case 4:
        return data.faculty > 0;
      case 5:
        return data.lab !== "";
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        return data.recommend !== "";
    }
    return false;
  };

  const progress = (i / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="text-center">
          <p className="font-display text-xl text-primary">
            Step {i + 1} of {steps.length}
          </p>
          <h1 className="mt-1 font-display text-5xl text-secondary sm:text-6xl">
            Orientation Feedback
          </h1>
          <Squiggle className="mx-auto mt-2 h-5 w-40 text-primary" />
        </div>

        {/* progress */}
        <div className="mt-8 flex items-center gap-2">
          {steps.map((_, k) => (
            <div
              key={k}
              className={`h-1.5 flex-1 rounded-full transition-colors ${k < i ? "bg-primary" : "bg-secondary/15"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-right text-xs text-muted-foreground">
          {Math.round(progress)}% complete
        </p>

        {/* notebook */}
        <div className="relative mt-8">
          <div
            className="absolute -left-3 top-8 bottom-8 hidden w-6 rounded-l-xl bg-repeat-y sm:block"
            style={{
              backgroundImage: "radial-gradient(circle at 12px 12px, #F7941D 4px, transparent 5px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="paper-card ruled-lines relative overflow-hidden p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="min-h-[280px]"
              >
                <p className="font-display text-3xl text-secondary sm:text-4xl">{steps[i]}</p>
                <div className="mt-6">
                  {i === 0 && (
                    <input
                      autoFocus
                      value={data.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full bg-transparent font-display text-3xl text-secondary outline-none placeholder:text-secondary/25"
                    />
                  )}
                  {i === 1 && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-8 w-8 flex-shrink-0 text-primary" />
                      <div className="flex-1">
                        <input
                          autoFocus
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={data.phone}
                          onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                          placeholder="10-digit mobile number"
                          className="w-full bg-transparent font-display text-3xl text-secondary outline-none placeholder:text-secondary/25"
                        />
                        {data.phone.length > 0 && !/^[6-9]\d{9}$/.test(data.phone) && (
                          <p className="mt-2 text-sm text-red-500">
                            Please enter a valid 10-digit Indian mobile number.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {COURSES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => set("course", c.id)}
                          className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${data.course === c.id ? "border-primary bg-primary/10" : "border-border bg-white/60 hover:border-primary/60"}`}
                        >
                          <GraduationCap
                            className={`h-6 w-6 ${data.course === c.id ? "text-primary" : "text-secondary/40"}`}
                          />
                          <span
                            className={`font-display text-xl font-bold ${data.course === c.id ? "text-primary" : "text-secondary"}`}
                          >
                            {c.label}
                          </span>
                          <span className="text-xs text-secondary/60 leading-tight">{c.sub}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {(i === 3 || i === 4) && (
                    <div className="flex flex-wrap items-center gap-3">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const val = i === 3 ? data.orientation : data.faculty;
                        const active = n <= val;
                        return (
                          <button
                            key={n}
                            onClick={() => (i === 3 ? set("orientation", n) : set("faculty", n))}
                            className="transition-transform hover:scale-110"
                          >
                            <StarIcon
                              className={`h-12 w-12 ${active ? "fill-primary text-primary" : "text-secondary/25"}`}
                            />
                          </button>
                        );
                      })}
                      <span className="ml-3 font-display text-3xl text-secondary/70">
                        {
                          ["", "meh", "ok", "good", "great", "brilliant"][
                            i === 3 ? data.orientation : data.faculty
                          ]
                        }
                      </span>
                    </div>
                  )}
                  {i === 5 && (
                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        { key: "excellent", label: "Excellent", I: ThumbsUp },
                        { key: "good", label: "Good", I: Smile },
                        { key: "average", label: "Average", I: Meh },
                        { key: "needs", label: "Needs work", I: Frown },
                      ].map(({ key, label, I }) => (
                        <button
                          key={key}
                          onClick={() => set("lab", key)}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition ${data.lab === key ? "border-primary bg-primary/10" : "border-border bg-white/60 hover:border-primary/60"}`}
                        >
                          <I className="h-8 w-8 text-primary" />
                          <span className="text-sm font-medium text-secondary">{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {i === 6 && (
                    <div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={data.facilities}
                        onChange={(e) => set("facilities", Number(e.target.value))}
                        className="w-full accent-[oklch(0.735_0.171_55)]"
                      />
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-sm text-muted-foreground">1 · barely</span>
                        <span className="font-display text-5xl text-primary">
                          {data.facilities}
                        </span>
                        <span className="text-sm text-muted-foreground">10 · loved it</span>
                      </div>
                    </div>
                  )}
                  {i === 7 && (
                    <textarea
                      value={data.suggestions}
                      onChange={(e) => set("suggestions", e.target.value)}
                      placeholder="Write anything you'd like the department to hear…"
                      rows={6}
                      className="w-full resize-none bg-transparent font-display text-2xl leading-9 text-secondary outline-none placeholder:text-secondary/25"
                    />
                  )}
                  {i === 8 && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "yes", label: "Absolutely", emoji: "🎉" },
                        { k: "maybe", label: "Maybe", emoji: "🤔" },
                        { k: "no", label: "Not yet", emoji: "😅" },
                      ].map((o) => (
                        <button
                          key={o.k}
                          onClick={() => set("recommend", o.k as Data["recommend"])}
                          className={`rounded-2xl border p-6 text-center transition ${data.recommend === o.k ? "border-primary bg-primary/10" : "border-border bg-white/60 hover:border-primary/60"}`}
                        >
                          <div className="text-4xl">{o.emoji}</div>
                          <div className="mt-2 font-display text-2xl text-secondary">{o.label}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setI(Math.max(0, i - 1))}
                disabled={i === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {i < steps.length - 1 ? (
                <button
                  onClick={() => canNext() && setI(i + 1)}
                  disabled={!canNext()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-magnetic disabled:opacity-40"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canNext() || submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-magnetic disabled:opacity-40"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Submit</span>
                      <PartyPopper className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-primary" /> Responses are anonymous unless you sign
          your name.
        </p>
      </section>
      <Footer />
    </div>
  );
}
