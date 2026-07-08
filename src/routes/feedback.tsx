import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Star as StarIcon, ThumbsUp, Smile, Meh, Frown, PartyPopper } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Squiggle } from "@/components/site/Doodles";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
  head: () => ({ meta: [{ title: "Orientation Feedback · CSC IT" }, { name: "description", content: "Share your CSC IT orientation experience in seven quick handwritten steps." }] }),
});

type Data = {
  name: string;
  orientation: number; faculty: number; lab: string; facilities: number;
  suggestions: string; recommend: "yes" | "maybe" | "no" | "";
};
const initial: Data = { name: "", orientation: 0, faculty: 0, lab: "", facilities: 5, suggestions: "", recommend: "" };

const steps = [
  "Your name",
  "Rate orientation", "Rate faculty", "Lab experience",
  "Campus facilities", "Suggestions", "Recommend us?",
];

function FeedbackPage() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [data, setData] = useState<Data>(initial);
  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  const canNext = () => {
    switch (i) {
      case 0: return data.name.trim().length > 1;
      case 1: return data.orientation > 0;
      case 2: return data.faculty > 0;
      case 3: return data.lab !== "";
      case 4: return true;
      case 5: return true;
      case 6: return data.recommend !== "";
    }
    return false;
  };

  const progress = (i / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="text-center">
          <p className="font-display text-xl text-primary">Step {i + 1} of {steps.length}</p>
          <h1 className="mt-1 font-display text-5xl text-secondary sm:text-6xl">Orientation Feedback</h1>
          <Squiggle className="mx-auto mt-2 h-5 w-40 text-primary" />
        </div>

        {/* progress */}
        <div className="mt-8 flex items-center gap-2">
          {steps.map((_, k) => (
            <div key={k} className={`h-1.5 flex-1 rounded-full transition-colors ${k < i ? "bg-primary" : "bg-secondary/15"}`} />
          ))}
        </div>
        <p className="mt-2 text-right text-xs text-muted-foreground">{Math.round(progress)}% complete</p>

        {/* notebook */}
        <div className="relative mt-8">
          <div className="absolute -left-3 top-8 bottom-8 hidden w-6 rounded-l-xl bg-repeat-y sm:block"
               style={{ backgroundImage: "radial-gradient(circle at 12px 12px, #F7941D 4px, transparent 5px)", backgroundSize: "24px 24px" }} />
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
                    <input autoFocus value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ananya Sharma"
                      className="w-full bg-transparent font-display text-3xl text-secondary outline-none placeholder:text-secondary/25" />
                  )}
                  {(i === 1 || i === 2) && (
                    <div className="flex flex-wrap items-center gap-3">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const val = i === 1 ? data.orientation : data.faculty;
                        const active = n <= val;
                        return (
                          <button key={n} onClick={() => (i === 1 ? set("orientation", n) : set("faculty", n))}
                            className="transition-transform hover:scale-110">
                            <StarIcon className={`h-12 w-12 ${active ? "fill-primary text-primary" : "text-secondary/25"}`} />
                          </button>
                        );
                      })}
                      <span className="ml-3 font-display text-3xl text-secondary/70">
                        {["", "meh", "ok", "good", "great", "brilliant"][i === 1 ? data.orientation : data.faculty]}
                      </span>
                    </div>
                  )}
                  {i === 3 && (
                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        { key: "excellent", label: "Excellent", I: ThumbsUp },
                        { key: "good", label: "Good", I: Smile },
                        { key: "average", label: "Average", I: Meh },
                        { key: "needs", label: "Needs work", I: Frown },
                      ].map(({ key, label, I }) => (
                        <button key={key} onClick={() => set("lab", key)}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition ${data.lab === key ? "border-primary bg-primary/10" : "border-border bg-white/60 hover:border-primary/60"}`}>
                          <I className="h-8 w-8 text-primary" />
                          <span className="text-sm font-medium text-secondary">{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {i === 4 && (
                    <div>
                      <input type="range" min={1} max={10} value={data.facilities} onChange={(e) => set("facilities", Number(e.target.value))}
                        className="w-full accent-[oklch(0.735_0.171_55)]" />
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-sm text-muted-foreground">1 · barely</span>
                        <span className="font-display text-5xl text-primary">{data.facilities}</span>
                        <span className="text-sm text-muted-foreground">10 · loved it</span>
                      </div>
                    </div>
                  )}
                  {i === 5 && (
                    <textarea value={data.suggestions} onChange={(e) => set("suggestions", e.target.value)}
                      placeholder="Write anything you'd like the department to hear…"
                      rows={6}
                      className="w-full resize-none bg-transparent font-display text-2xl leading-9 text-secondary outline-none placeholder:text-secondary/25" />
                  )}
                  {i === 6 && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "yes", label: "Absolutely", emoji: "🎉" },
                        { k: "maybe", label: "Maybe", emoji: "🤔" },
                        { k: "no", label: "Not yet", emoji: "😅" },
                      ].map((o) => (
                        <button key={o.k} onClick={() => set("recommend", o.k as Data["recommend"])}
                          className={`rounded-2xl border p-6 text-center transition ${data.recommend === o.k ? "border-primary bg-primary/10" : "border-border bg-white/60 hover:border-primary/60"}`}>
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
              <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-secondary disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {i < steps.length - 1 ? (
                <button onClick={() => canNext() && setI(i + 1)} disabled={!canNext()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-magnetic disabled:opacity-40">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={() => canNext() && nav({ to: "/thank-you" })} disabled={!canNext()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-magnetic disabled:opacity-40">
                  Submit <PartyPopper className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-primary" /> Responses are anonymous unless you sign your name.
        </p>
      </section>
      <Footer />
    </div>
  );
}
