import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from "recharts";
import {
  LogOut, Users, ImageIcon, FlaskConical, UserCircle2, BarChart2,
  Upload, Trash2, Eye, EyeOff, Loader2, RefreshCw, ChevronDown, ChevronUp, Star, X,
} from "lucide-react";
import { supabase, type FeedbackRow } from "@/lib/supabase";

// ─── env credentials ──────────────────────────────────────────────────────────
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER ?? "";
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS ?? "";

// ─── buckets ──────────────────────────────────────────────────────────────────
const BUCKET_SLIDES  = "slideshow";
const BUCKET_LABS    = "labs";
const BUCKET_FACULTY = "faculty";

const COLORS = ["#F7941D", "#2D2A22", "#CDEBFF", "#D8F5C4", "#FFD6C0", "#FFDDE7"];

function avg(arr: number[]) {
  return arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT — must be declared before Route
// ══════════════════════════════════════════════════════════════════════════════
function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("csc_admin") === "1");
  if (!authed)
    return (
      <LoginScreen
        onLogin={() => {
          sessionStorage.setItem("csc_admin", "1");
          setAuthed(true);
        }}
      />
    );
  return (
    <Dashboard
      onLogout={() => {
        sessionStorage.removeItem("csc_admin");
        setAuthed(false);
      }}
    />
  );
}

export const Route = createFileRoute("/admin")({ component: AdminPage });

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!u || !p) { setErr("Please enter username and password."); return; }
    setLoading(true);
    setTimeout(() => {
      if (u === ADMIN_USER && p === ADMIN_PASS) {
        onLogin();
      } else {
        setErr("Invalid username or password.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[oklch(0.88_0.01_60)] bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[oklch(0.735_0.171_55)]">
            <Star className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D2A22]">Admin Panel</h1>
          <p className="mt-1 text-sm text-[#2D2A22]/60">CSC IT Department · Orientation</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#2D2A22]/60">Username</label>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="admin"
              className="w-full rounded-xl border border-[oklch(0.88_0.01_60)] bg-[#FAF8F4] px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.735_0.171_55)] focus:ring-2 focus:ring-[oklch(0.735_0.171_55)]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#2D2A22]/60">Password</label>
            <div className="relative">
              <input
                value={p}
                onChange={(e) => setP(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[oklch(0.88_0.01_60)] bg-[#FAF8F4] px-4 py-2.5 pr-10 text-sm outline-none focus:border-[oklch(0.735_0.171_55)] focus:ring-2 focus:ring-[oklch(0.735_0.171_55)]/20"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2A22]/40 hover:text-[#2D2A22]"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[oklch(0.735_0.171_55)] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SHELL
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "overview",  label: "Overview",   icon: BarChart2   },
  { id: "responses", label: "Responses",  icon: Users       },
  { id: "slides",    label: "Slideshow",  icon: ImageIcon   },
  { id: "labs",      label: "Lab Photos", icon: FlaskConical},
  { id: "faculty",   label: "Faculty",    icon: UserCircle2 },
] as const;
type TabId = (typeof TABS)[number]["id"];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("overview");
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    setFeedback((data as FeedbackRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadFeedback(); }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[oklch(0.88_0.01_60)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[oklch(0.735_0.171_55)]">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D2A22]">Admin Panel</p>
              <p className="text-xs text-[#2D2A22]/50">CSC IT Orientation 2026</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-[oklch(0.88_0.01_60)] bg-white px-3 py-1.5 text-xs font-medium text-[#2D2A22]/70 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>

        {/* Tab bar */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition
                  ${tab === t.id
                    ? "border-[oklch(0.735_0.171_55)] text-[oklch(0.735_0.171_55)]"
                    : "border-transparent text-[#2D2A22]/50 hover:text-[#2D2A22]"
                  }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {tab === "overview"  && <OverviewTab  feedback={feedback} loading={loading} onRefresh={loadFeedback} />}
        {tab === "responses" && <ResponsesTab feedback={feedback} loading={loading} onRefresh={loadFeedback} />}
        {tab === "slides"    && <MediaTab bucket={BUCKET_SLIDES}  title="Slideshow Images" hint="Shown in the home page hero carousel." />}
        {tab === "labs"      && <MediaTab bucket={BUCKET_LABS}    title="Lab Photos"       hint="Shown in the Explore page labs section." />}
        {tab === "faculty"   && <FacultyTab />}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
function OverviewTab({ feedback, loading, onRefresh }: { feedback: FeedbackRow[]; loading: boolean; onRefresh: () => void }) {
  if (loading) return <Spinner />;

  const total            = feedback.length;
  const avgOrientation   = avg(feedback.map((f) => f.orientation));
  const avgFaculty       = avg(feedback.map((f) => f.faculty));
  const avgFacilities    = avg(feedback.map((f) => f.facilities));

  const recData = [
    { name: "Absolutely 🎉", value: feedback.filter((f) => f.recommend === "yes").length   },
    { name: "Maybe 🤔",      value: feedback.filter((f) => f.recommend === "maybe").length },
    { name: "Not yet 😅",    value: feedback.filter((f) => f.recommend === "no").length    },
  ];

  const labData = ["excellent","good","average","needs"].map((k) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    value: feedback.filter((f) => f.lab === k).length,
  }));

  const radarData = [
    { subject: "Orientation", A: avgOrientation * 2, fullMark: 10 },
    { subject: "Faculty",     A: avgFaculty     * 2, fullMark: 10 },
    { subject: "Facilities",  A: avgFacilities,       fullMark: 10 },
  ];

  const ratingDist = [1,2,3,4,5].map((n) => ({
    rating: `⭐ ${n}`,
    orientation: feedback.filter((f) => f.orientation === n).length,
    faculty:     feedback.filter((f) => f.faculty     === n).length,
  }));

  // Last 7 days timeline
  const days: Record<string, number> = {};
  for (let d = 6; d >= 0; d--) {
    const dt = new Date(Date.now() - d * 86400000);
    days[dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })] = 0;
  }
  feedback.forEach((f) => {
    const key = new Date(f.created_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
    if (key in days) days[key]++;
  });
  const timelineData = Object.entries(days).map(([date, count]) => ({ date, count }));

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Submissions", value: total,              sub: "feedback forms", dark: true  },
          { label: "Avg. Orientation",  value: `${avgOrientation}/5`, sub: "star rating",   dark: false },
          { label: "Avg. Faculty",      value: `${avgFaculty}/5`,     sub: "star rating",   dark: false },
          { label: "Avg. Facilities",   value: `${avgFacilities}/10`, sub: "score",         dark: true  },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 text-white ${s.dark ? "bg-[#2D2A22]" : "bg-[oklch(0.735_0.171_55)]"}`}>
            <p className="text-xs font-medium uppercase tracking-wider opacity-60">{s.label}</p>
            <p className="mt-1 text-4xl font-bold">{s.value}</p>
            <p className="text-xs opacity-50">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={onRefresh} className="flex items-center gap-1.5 rounded-xl border border-[oklch(0.88_0.01_60)] bg-white px-3 py-1.5 text-xs font-medium text-[#2D2A22]/70 transition hover:bg-[#FAF8F4]">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Submissions — Last 7 Days">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Submissions" fill="oklch(0.735 0.171 55)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Would You Recommend?">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={recData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {recData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Lab Experience">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={labData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" name="Students" fill="#2D2A22" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Overall Satisfaction Radar">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <Radar name="Avg Score" dataKey="A" stroke="oklch(0.735 0.171 55)" fill="oklch(0.735 0.171 55)" fillOpacity={0.35} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Rating Distribution — Orientation vs Faculty">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ratingDist}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
            <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orientation" name="Orientation" fill="oklch(0.735 0.171 55)" radius={[4,4,0,0]} />
            <Bar dataKey="faculty"     name="Faculty"     fill="#2D2A22"               radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[oklch(0.88_0.01_60)] bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-[#2D2A22]">{title}</p>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RESPONSES TABLE
// ══════════════════════════════════════════════════════════════════════════════
function ResponsesTab({ feedback, loading, onRefresh }: { feedback: FeedbackRow[]; loading: boolean; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#2D2A22]">{feedback.length} total submissions</p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 rounded-xl border border-[oklch(0.88_0.01_60)] bg-white px-3 py-1.5 text-xs font-medium text-[#2D2A22]/70 transition hover:bg-[#FAF8F4]">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {feedback.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[oklch(0.88_0.01_60)] p-12 text-center text-sm text-[#2D2A22]/40">
          No submissions yet. Share the feedback link with students!
        </div>
      )}

      <div className="space-y-3">
        {feedback.map((f) => (
          <div key={f.id} className="overflow-hidden rounded-2xl border border-[oklch(0.88_0.01_60)] bg-white">
            <button
              onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#FAF8F4]"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-[oklch(0.735_0.171_55)]/10 text-sm font-bold text-[oklch(0.735_0.171_55)]">
                  {f.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2A22]">{f.name || "Anonymous"}</p>
                  <p className="text-xs text-[#2D2A22]/50">{new Date(f.created_at).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden gap-2 sm:flex">
                  <Badge label={`⭐ ${f.orientation}/5`} />
                  <Badge label={`👨‍🏫 ${f.faculty}/5`} />
                  <Badge label={f.recommend === "yes" ? "✅ Recommends" : f.recommend === "maybe" ? "🤔 Maybe" : "😅 Not yet"} />
                </div>
                {expanded === f.id ? <ChevronUp className="h-4 w-4 text-[#2D2A22]/40" /> : <ChevronDown className="h-4 w-4 text-[#2D2A22]/40" />}
              </div>
            </button>

            {expanded === f.id && (
              <div className="grid gap-4 border-t border-[oklch(0.88_0.01_60)] bg-[#FAF8F4] px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Orientation Rating" value={`${"⭐".repeat(f.orientation)} (${f.orientation}/5)`} />
                <Field label="Faculty Rating"     value={`${"⭐".repeat(f.faculty)} (${f.faculty}/5)`} />
                <Field label="Lab Experience"     value={f.lab ? f.lab.charAt(0).toUpperCase() + f.lab.slice(1) : "—"} />
                <Field label="Facilities Score"   value={`${f.facilities}/10`} />
                <Field label="Would Recommend"    value={f.recommend === "yes" ? "Absolutely 🎉" : f.recommend === "maybe" ? "Maybe 🤔" : "Not yet 😅"} />
                {f.suggestions && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Field label="Suggestions" value={f.suggestions} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[oklch(0.88_0.01_60)] bg-[#FAF8F4] px-2.5 py-1 text-xs text-[#2D2A22]/70">
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#2D2A22]/40">{label}</p>
      <p className="mt-0.5 text-sm text-[#2D2A22]">{value}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MEDIA TAB — Slideshow & Labs (with gallery + drag-drop upload)
// ══════════════════════════════════════════════════════════════════════════════
type MediaFile = { name: string; url: string };

function MediaTab({ bucket, title, hint }: { bucket: string; title: string; hint: string }) {
  const [files, setFiles]       = useState<MediaFile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption]   = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.storage
      .from(bucket)
      .list("", { sortBy: { column: "created_at", order: "desc" } });
    const items = (data ?? [])
      .filter((f) => !f.name.startsWith("."))
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl,
      }));
    setFiles(items);
    setLoading(false);
  };

  useEffect(() => { load(); }, [bucket]);

  const doUpload = async (file: File) => {
    setUploading(true);
    setProgress(10);
    const ext  = file.name.split(".").pop();
    const name = caption.trim()
      ? `${caption.trim().replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.${ext}`
      : `${Date.now()}.${ext}`;

    setProgress(40);
    const { error } = await supabase.storage.from(bucket).upload(name, file, { upsert: true });
    setProgress(90);
    if (!error) { setCaption(""); if (fileRef.current) fileRef.current.value = ""; }
    await load();
    setProgress(100);
    setTimeout(() => { setUploading(false); setProgress(0); }, 400);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) doUpload(file);
  };

  const remove = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.storage.from(bucket).remove([name]);
    await load();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#2D2A22]">{title}</h2>
        <p className="text-sm text-[#2D2A22]/50">{hint}</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mb-6 rounded-2xl border-2 border-dashed p-8 text-center transition
          ${dragOver ? "border-[oklch(0.735_0.171_55)] bg-[oklch(0.735_0.171_55)]/10" : "border-[oklch(0.88_0.01_60)] bg-white"}`}
      >
        <Upload className={`mx-auto mb-3 h-8 w-8 ${dragOver ? "text-[oklch(0.735_0.171_55)]" : "text-[#2D2A22]/30"}`} />
        <p className="text-sm font-medium text-[#2D2A22]">Drag & drop an image here, or</p>
        <p className="mb-4 text-xs text-[#2D2A22]/50">PNG, JPG, WEBP supported</p>

        <div className="flex flex-wrap items-end justify-center gap-3">
          <div>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption / label (optional)"
              className="w-56 rounded-xl border border-[oklch(0.88_0.01_60)] bg-[#FAF8F4] px-3 py-2 text-sm outline-none focus:border-[oklch(0.735_0.171_55)]"
            />
          </div>
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition
            ${uploading ? "pointer-events-none bg-[#2D2A22]/10 text-[#2D2A22]/40" : "bg-[oklch(0.735_0.171_55)] text-white hover:opacity-90"}`}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Choose from Gallery"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture={undefined}
              className="hidden"
              onChange={onFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="mx-auto mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-[#F0EDE8]">
            <div
              className="h-full rounded-full bg-[oklch(0.735_0.171_55)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Image grid */}
      {loading ? <Spinner /> : (
        <>
          {files.length === 0 && (
            <p className="py-10 text-center text-sm text-[#2D2A22]/40">
              No images yet. Upload one above.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((f) => (
              <div key={f.name} className="group relative overflow-hidden rounded-2xl border border-[oklch(0.88_0.01_60)] bg-white">
                <div className="aspect-video cursor-pointer overflow-hidden bg-[#F0EDE8]" onClick={() => setPreview(f.url)}>
                  <img src={f.url} alt={f.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                  <p className="truncate text-xs font-medium text-[#2D2A22]">{f.name}</p>
                  <button
                    onClick={() => remove(f.name)}
                    className="flex-shrink-0 rounded-lg p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
          <img
            src={preview}
            alt="Preview"
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FACULTY TAB
// ══════════════════════════════════════════════════════════════════════════════
const DEFAULT_FACULTY = [
    { id: "Vaishali Rajput",   name: "Dr. Vaishali Rajput", role: "I/C Principal, SDC Director", qual: "Ph.D, M.Com", tint: "#D8F5C4" },
  { id: "Sandeep Vishwakarma",  name: "Mr. Sandeep Vishwakarma", role: "HOD · IT Dept.", qual: "B.Sc. (Physics), MCA, MBA, Ph.D. Scholar", tint: "#FFE7B8" },
  { id: "Arvind Singh",  name: "Mr. Arvind Singh", role: "Coordinator-B.Sc.IT, B.Sc. CS & DF", qual: "M.Sc. (Computer Science)", tint: "#FFD6C0" },
  { id: "Sailaja Tiwari",   name: "Ms. Sailaja Tiwari", role: "Assistant Professor", qual: "M.Sc.IT", tint: "#CDEBFF" },
  { id: "Dheeraj Vishwakarma",  name: "Mr. Dheeraj Vishwakarma", role: "Assistant Professor", qual: "MSc(Statistics), B.Ed", tint: "#FFD6C0" },
  { id: "Vani Bandi",   name: "Ms. Vani Bandi", role: "Assistant Professor", qual: "MSc(Statistics)", tint: "#CDEBFF" },
  { id: "Sahil Bhalekar",   name: "Mr. Sahil Bhalekar", role: "Assistant Professor", qual: "Mr. Sahil Bhalekar", tint: "#CDEBFF" },
  
];

function FacultyTab() {
  const [photos, setPhotos]     = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const loadPhotos = async () => {
    const result: Record<string, string> = {};
    for (const m of DEFAULT_FACULTY) {
      const { data } = await supabase.storage.from(BUCKET_FACULTY).list("", { search: m.id });
      if (data && data.length > 0) {
        result[m.id] = supabase.storage.from(BUCKET_FACULTY).getPublicUrl(data[0].name).data.publicUrl;
      }
    }
    setPhotos(result);
  };

  useEffect(() => { loadPhotos(); }, []);

  const upload = async (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(memberId);
    const ext  = file.name.split(".").pop();
    const name = `${memberId}.${ext}`;
    const { data: old } = await supabase.storage.from(BUCKET_FACULTY).list("", { search: memberId });
    if (old && old.length > 0)
      await supabase.storage.from(BUCKET_FACULTY).remove(old.map((f) => f.name));
    await supabase.storage.from(BUCKET_FACULTY).upload(name, file, { upsert: true });
    await loadPhotos();
    setUploading(null);
  };

  const remove = async (memberId: string) => {
    if (!confirm("Remove this faculty photo?")) return;
    const { data } = await supabase.storage.from(BUCKET_FACULTY).list("", { search: memberId });
    if (data && data.length > 0)
      await supabase.storage.from(BUCKET_FACULTY).remove(data.map((f) => f.name));
    await loadPhotos();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#2D2A22]">Faculty Photos</h2>
        <p className="text-sm text-[#2D2A22]/50">Upload a photo for each faculty member. Displayed on the Explore page.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {DEFAULT_FACULTY.map((m) => (
          <div key={m.id} className="rounded-2xl border border-[oklch(0.88_0.01_60)] bg-white p-5 text-center">
            <div className="relative mx-auto mb-3 h-24 w-24">
              {photos[m.id] ? (
                <img
                  src={photos[m.id]}
                  alt={m.name}
                  className="h-full w-full rounded-full border-2 border-[oklch(0.735_0.171_55)]/30 object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[oklch(0.735_0.171_55)]/10 text-3xl font-bold text-[oklch(0.735_0.171_55)]">
                  {m.name.charAt(0)}
                </div>
              )}
              {uploading === m.id && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80">
                  <Loader2 className="h-6 w-6 animate-spin text-[oklch(0.735_0.171_55)]" />
                </div>
              )}
            </div>

            <p className="text-sm font-bold text-[#2D2A22]">{m.name}</p>
            <p className="mb-4 text-xs text-[#2D2A22]/50">{m.role}</p>

            <div className="flex gap-2">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[oklch(0.735_0.171_55)] px-2 py-1.5 text-xs font-semibold text-[oklch(0.735_0.171_55)] transition hover:bg-[oklch(0.735_0.171_55)]/10">
                <Upload className="h-3 w-3" />
                {photos[m.id] ? "Change" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading === m.id}
                  onChange={(e) => upload(m.id, e)}
                />
              </label>
              {photos[m.id] && (
                <button
                  onClick={() => remove(m.id)}
                  className="flex items-center justify-center rounded-xl border border-red-200 px-2.5 py-1.5 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED
// ══════════════════════════════════════════════════════════════════════════════
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.735_0.171_55)]" />
    </div>
  );
}
