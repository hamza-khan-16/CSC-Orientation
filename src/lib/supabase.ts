import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type FeedbackRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  course: string;
  orientation: number;
  faculty: number;
  lab: string;
  facilities: number;
  suggestions: string;
  recommend: "yes" | "maybe" | "no";
};

export const COURSES = [
  { id: "bscit", label: "B.Sc.IT", sub: "Information Technology" },
  { id: "bscds", label: "B.Sc.DS", sub: "Data Science" },
  { id: "bscaiml", label: "B.Sc.(AI & ML)", sub: "Artificial Intelligence & Machine Learning" },
  { id: "bsccsdf", label: "B.Sc.(CS & DF)", sub: "Cyber Security & Digital Forensics" },
  { id: "bscvfx", label: "B.Sc.(VFX)", sub: "Animation & Visual Effects" },
  { id: "bca", label: "BCA", sub: "Computer Applications" },
] as const;

export type CourseId = (typeof COURSES)[number]["id"];
