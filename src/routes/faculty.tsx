import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, GraduationCap, ArrowLeft, Search } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase, type FacultyMember } from "@/lib/supabase";
import { Squiggle } from "@/components/site/Doodles";

export const Route = createFileRoute("/faculty")({
  component: FacultyPage,
  head: () => ({
    meta: [
      { title: "Faculty · Chandrabhan Sharma College" },
      { name: "description", content: "Meet all the faculty members of Chandrabhan Sharma College." },
    ],
  }),
});

function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("faculty_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setFaculty(data as FacultyMember[]);
      setLoading(false);
    })();
  }, []);

  const filtered = faculty.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.degree?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <Link
          to="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-secondary/60 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xl text-primary">Our People</p>
            <h1 className="font-display text-6xl leading-[0.95] text-secondary sm:text-7xl">
              Meet the{" "}
              <span className="ink-underline text-primary">Faculty</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              {faculty.length > 0
                ? `${faculty.length} dedicated educators shaping the next generation of technologists at CSC.`
                : "Dedicated educators shaping the next generation at CSC."}
            </p>
          </div>
          <Squiggle className="hidden h-6 w-40 text-primary sm:block" />
        </div>

        {/* Search bar */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, or qualification…"
            className="flex-1 bg-transparent text-sm text-secondary outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-muted-foreground hover:text-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="paper-card h-64 animate-pulse rounded-2xl bg-secondary/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="mb-4 h-12 w-12 text-secondary/20" />
            <p className="font-display text-2xl text-secondary/40">
              {search ? `No results for "${search}"` : "No faculty members yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-primary underline underline-offset-4"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {search && (
              <p className="mb-6 text-sm text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
                  whileTap={{ y: -3, scale: 0.97 }}
                  className="relative paper-card p-6 text-center"
                >
                  <span className="tape left-1/2 -top-3 -translate-x-1/2 rotate-[-6deg]" />

                  {/* Avatar */}
                  <div
                    className="mx-auto h-28 w-28 overflow-hidden rounded-full shadow-md"
                    style={{ background: m.tint }}
                  >
                    {m.photo_url ? (
                      <img
                        src={m.photo_url}
                        alt={m.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-secondary/40">
                        <Users className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h2 className="mt-4 font-display text-2xl leading-tight text-secondary">
                    {m.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary">{m.role}</p>
                  {m.degree && (
                    <p className="mt-2 flex items-start justify-center gap-1 text-xs text-secondary/60">
                      <GraduationCap className="mt-[1px] h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-center leading-snug">{m.degree}</span>
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}