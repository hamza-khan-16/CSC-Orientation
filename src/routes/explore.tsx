import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  Trophy,
  Briefcase,
  Cpu,
  Wifi,
  Shield,
  Code2,
  Network,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { supabase } from "@/lib/supabase";
import { Footer } from "@/components/site/Footer";
import { Star, Squiggle, Arrow } from "@/components/site/Doodles";
import labComputer from "@/assets/lab-computer.jpg";
import labAI from "@/assets/lab-ai.jpg";
import labNetwork from "@/assets/lab-network.jpg";
import students from "@/assets/students.jpg";
import campus from "@/assets/campus.webp";

export const Route = createFileRoute("/explore")({
  component: Explore,
  head: () => ({
    meta: [
      { title: "Explore CSC · Chandrabhan Sharma College" },
      {
        name: "description",
        content:
          "Meet Chandrabhan Sharma College: faculty, labs, projects, placements and achievements.",
      },
      { property: "og:title", content: "Explore Chandrabhan Sharma College" },
      {
        property: "og:description",
        content: "Faculty, labs, projects and placements at Chandrabhan Sharma College.",
      },
    ],
  }),
});

const stats = [
  { n: 850, s: "+", label: "Students" },
  { n: 32, s: "+", label: "Faculty" },
  { n: 95, s: "%", label: "Placement" },
  { n: 50, s: "+", label: "Projects" },
  { n: 20, s: "+", label: "Recruiters" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span className="font-num">
      {n}
      {suffix}
    </span>
  );
}

const labs = [
  { name: "Computer Lab", icon: Cpu, fallback: labComputer, note: "60 workstations · dual-boot" },
  { name: "AI & ML Lab", icon: Star, fallback: labAI, note: "NVIDIA GPUs · Jupyter cluster" },
  {
    name: "Networking Lab",
    icon: Network,
    fallback: labNetwork,
    note: "Cisco routers · Packet Tracer",
  },
  { name: "IoT Lab", icon: Wifi, fallback: labComputer, note: "Raspberry Pi · Arduino kits" },
  { name: "Cyber Security Lab", icon: Shield, fallback: labNetwork, note: "Kali · CTF sandbox" },
  { name: "Programming Lab", icon: Code2, fallback: students, note: "Multi-language, 24/7 access" },
];

const faculty = [
<<<<<<< HEAD
  {
    id: "Vaishali Rajput",
    name: "Dr. Vaishali Rajput",
    role: "I/C Principal, SDC Director",
    qual: "Ph.D, M.Com",
    tint: "#D8F5C4",
  },
  {
    id: "Sandeep Vishwakarma",
    name: "Mr. Sandeep Vishwakarma",
    role: "HOD · IT Dept.",
    qual: "B.Sc. (Physics), MCA, MBA, Ph.D. Scholar",
    tint: "#FFE7B8",
  },
  {
    id: "Arvind Singh",
    name: "Mr. Arvind Singh",
    role: "Coordinator-B.Sc.IT, B.Sc. CS & DF",
    qual: "M.Sc. (Computer Science)",
    tint: "#FFD6C0",
  },
  {
    id: "Sailaja Tiwari",
    name: "Ms. Sailaja Tiwari",
    role: "Assistant Professor",
    qual: "M.Sc.IT",
    tint: "#CDEBFF",
  },
  {
    id: "Dheeraj Vishwakarma",
    name: "Mr. Dheeraj Vishwakarma",
    role: "Assistant Professor",
    qual: "MSc(Statistics), B.Ed",
    tint: "#FFD6C0",
  },
  {
    id: "Vani Bandi",
    name: "Ms. Vani Bandi",
    role: "Assistant Professor",
    qual: "MSc(Statistics)",
    tint: "#CDEBFF",
  },
  {
    id: "Sahil Bhalekar",
    name: "Mr. Sahil Bhalekar",
    role: "Assistant Professor",
    qual: "MCA",
    tint: "#CDEBFF",
  },
  {
    id: "Priyam Chavan",
    name: "Mr. Priyam Chavan",
    role: "Assistant Professor",
    qual: "M.Sc.IT",
    tint: "#CDEBFF",
  },
  {
    id: "Vikesh Kumar Singh",
    name: "Mr. Vikesh Kumar Singh",
    role: "Assistant Professor",
    qual: "Animation & VFX Expert",
    tint: "#CDEBFF",
  },
=======
   { id: "Vaishali Rajput",   name: "Dr. Vaishali Rajput", role: "I/C Principal, SDC Director", qual: "Ph.D, M.Com", tint: "#D8F5C4" },
  { id: "Sandeep Vishwakarma",  name: "Mr. Sandeep Vishwakarma", role: "HOD · IT Dept.", qual: "B.Sc. (Physics), MCA, MBA, Ph.D. Scholar", tint: "#FFE7B8" },
  { id: "Arvind Singh",  name: "Mr. Arvind Singh", role: "Coordinator-B.Sc.IT, B.Sc. CS & DF", qual: "M.Sc. (Computer Science)", tint: "#FFD6C0" },
  { id: "Sailaja Tiwari",   name: "Ms. Sailaja Tiwari", role: "Assistant Professor", qual: "M.Sc.IT", tint: "#CDEBFF" },
  { id: "Dheeraj Vishwakarma",  name: "Mr. Dheeraj Vishwakarma", role: "Assistant Professor", qual: "MSc(Statistics), B.Ed", tint: "#FFD6C0" },
  { id: "Vani Bandi",   name: "Ms. Vani Bandi", role: "Assistant Professor", qual: "MSc(Statistics)", tint: "#CDEBFF" },
  { id: "Sahil Bhalekar",   name: "Mr. Sahil Bhalekar", role: "Assistant Professor", qual: "Mr. Sahil Bhalekar", tint: "#CDEBFF" },
  
  
>>>>>>> 45fd08b0aa9fd7e1d06db408977c9bcdc88ef5ee
];

const projects = [
  { title: "Smart Attendance System", tint: "#FFF4B8", rot: "-2deg" },
  { title: "Virtual Assistant Chatbot", tint: "#FFD6C0", rot: "1.5deg" },
  { title: "AI Image Classifier", tint: "#D8F5C4", rot: "-1deg" },
  { title: "College Event Manager", tint: "#FFDDE7", rot: "2deg" },
  { title: "Real-time Chat App", tint: "#CDEBFF", rot: "-1.5deg" },
  { title: "Campus Navigator VR", tint: "#E8DDFF", rot: "1deg" },
];

const testimonials = [
  {
    name: "Ananya S.",
    quote: "Orientation was amazing! Got a clear idea about labs, opportunities and my future.",
    tint: "#FFF4B8",
  },
  {
    name: "Rohit P.",
    quote: "The faculty are very supportive and the vibe is just awesome.",
    tint: "#D8F5C4",
  },
  {
    name: "Mehak T.",
    quote: "Best department with great exposure and practical learning.",
    tint: "#CDEBFF",
  },
  {
    name: "Kabir J.",
    quote: "Loved the labs — got hands-on with AI hardware from day one.",
    tint: "#FFD6C0",
  },
];

function Explore() {
  const [facultyPhotos, setFacultyPhotos] = useState<Record<string, string>>({});
  const [labPhotos, setLabPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Faculty photos
    (async () => {
      const result: Record<string, string> = {};
      for (const m of faculty) {
        const { data } = await supabase.storage.from("faculty").list("", { search: m.id });
        if (data && data.length > 0) {
          result[m.id] = supabase.storage.from("faculty").getPublicUrl(data[0].name).data.publicUrl;
        }
      }
      setFacultyPhotos(result);
    })();

    // Lab photos
    (async () => {
      const { data } = await supabase.storage
        .from("labs")
        .list("", { sortBy: { column: "created_at", order: "asc" } });
      const items = (data ?? []).filter((f) => !f.name.startsWith("."));
      if (items.length > 0) {
        setLabPhotos(
          items.map((f) => supabase.storage.from("labs").getPublicUrl(f.name).data.publicUrl),
        );
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-display text-xl text-primary">Innovate · Code · Transform</p>
            <h1 className="mt-1 font-display text-7xl leading-[0.95] text-secondary sm:text-8xl">
              Explore <span className="ink-underline text-primary">CSC</span>
            </h1>
            <p className="mt-5 max-w-lg text-muted-foreground">
              Six labs, thirty-two faculty, hundreds of student-built projects — this is where the
              next generation of engineers gets built at Chandrabhan Sharma College.
            </p>
          </div>
          <div className="relative">
            <span className="tape left-8 -top-3 rotate-[-6deg]" />
            <img
              src={campus}
              alt="CSC campus"
              width={1280}
              height={960}
              className="aspect-[16/10] w-full rounded-2xl object-cover shadow-xl"
            />
            <Arrow className="absolute -bottom-10 -left-6 hidden h-16 w-32 text-secondary/50 sm:block" />
          </div>
        </div>

        {/* stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl paper-card p-6 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-5xl text-secondary sm:text-6xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Labs */}
      <section id="labs" className="mx-auto mt-20 max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xl text-primary">Our Labs</p>
            <h2 className="font-display text-5xl text-secondary">Hands-on, always-on.</h2>
          </div>
          <Squiggle className="hidden h-6 w-40 text-primary sm:block" />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((l, i) => (
            <motion.div
              key={l.name}
              whileHover={{ y: -6, rotate: -0.5 }}
              whileTap={{ y: -3, rotate: -0.5, scale: 0.98 }}
              className="paper-card overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={labPhotos[i] ?? l.fallback}
                  alt={l.name}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <l.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-2xl text-secondary">{l.name}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{l.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Faculty */}
      <section id="faculty" className="mx-auto mt-20 max-w-7xl px-6">
        <p className="font-display text-xl text-primary">Our Faculty</p>
        <h2 className="font-display text-5xl text-secondary">Mentors on speed-dial.</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faculty.map((f, i) => (
            <motion.div
              key={f.name}
              whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
              whileTap={{ y: -3, scale: 0.97 }}
              className="relative paper-card p-6 text-center"
            >
              <span className="tape left-1/2 -top-3 -translate-x-1/2 rotate-[-6deg]" />
              <div
                className="mx-auto h-24 w-24 overflow-hidden rounded-full"
                style={{ background: f.tint }}
              >
                {facultyPhotos[f.id] ? (
                  <img
                    src={facultyPhotos[f.id]}
                    alt={f.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-secondary">
                    <Users className="h-10 w-10" />
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-display text-2xl text-secondary">{f.name}</h3>
              <p className="text-sm text-muted-foreground">{f.role}</p>
              <p className="text-xs text-secondary/60">{f.qual}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <p id="projects" className="font-display text-xl text-primary">
          Student Projects
        </p>
        <h2 className="font-display text-5xl text-secondary">A wall of ideas that shipped.</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <motion.div
              key={p.title}
              whileHover={{ y: -8, rotate: 0 }}
              whileTap={{ y: -4, scale: 0.97 }}
              style={{ background: p.tint, transform: `rotate(${p.rot})` }}
              className="relative rounded-md p-6 shadow-[2px_10px_28px_-12px_rgba(0,0,0,0.28)]"
            >
              <span className="tape left-1/2 -top-3 -translate-x-1/2 rotate-[-4deg]" />
              <h3 className="font-display text-3xl text-secondary">{p.title}</h3>
              <p className="mt-2 text-sm text-secondary/70">
                Built by IT students in a semester sprint.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Placements */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-6 rounded-3xl paper-card p-8 md:grid-cols-3">
          {[
            { icon: Trophy, label: "Highest Package", value: "₹ 32 LPA" },
            { icon: Briefcase, label: "Average Package", value: "₹ 6.8 LPA" },
            { icon: GraduationCap, label: "Placement Rate", value: "95%" },
          ].map((p) => (
            <div key={p.label} className="rounded-2xl bg-white p-6">
              <p.icon className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm uppercase tracking-widest text-muted-foreground">
                {p.label}
              </p>
              <p className="mt-1 font-display text-5xl text-secondary">{p.value}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <p className="text-sm text-muted-foreground">Top recruiters</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {["Microsoft", "TCS", "Infosys", "Wipro", "Cognizant", "Amazon", "Deloitte"].map(
                (r) => (
                  <span
                    key={r}
                    className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-secondary"
                  >
                    {r}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <p className="font-display text-xl text-primary">What students say</p>
        <h2 className="font-display text-5xl text-secondary">Notes from the corridor.</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -6 }}
              whileTap={{ y: -3, scale: 0.97 }}
              style={{ background: t.tint, transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
              className="relative rounded-md p-5 shadow-[2px_10px_24px_-12px_rgba(0,0,0,0.25)]"
            >
              <span className="tape left-1/2 -top-3 -translate-x-1/2 rotate-[-6deg]" />
              <p className="font-display text-lg leading-snug text-secondary">“{t.quote}”</p>
              <p className="mt-3 text-sm text-secondary/70">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-6 rounded-3xl paper-card p-8 md:grid-cols-2">
          <div>
            <p className="font-display text-xl text-primary">Get in touch</p>
            <h2 className="font-display text-5xl text-secondary">Come say hi to CSC.</h2>
            <ul className="mt-6 space-y-3 text-secondary/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                Department of Information Technology, Chandrabhan Sharma College, Powai-Vihar,
                Powai, Mumbai — 400076
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                itdept@cschcollege.edu.in
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  ⏱
                </span>{" "}
                Mon – Fri · 9:00 AM to 6:00 PM
              </li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
            <iframe
              title="CSC map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.899%2C19.114%2C72.907%2C19.120&layer=mapnik&marker=19.116556%2C72.902717"
              className="h-full min-h-[280px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
