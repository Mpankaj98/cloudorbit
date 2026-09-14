import { Router, Request, Response } from "express";
import { pool } from "../db";

export const leadsRouter = Router();

export const COURSES = ["CI/CD", "Cloud & AWS", "Docker & Kubernetes", "Monitoring"] as const;
export const PROFESSIONS = ["Working professional", "Student"] as const;
type Course = (typeof COURSES)[number];
type Profession = (typeof PROFESSIONS)[number];

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  profession: Profession;
  course: Course;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<LeadPayload>): string | null {
  if (!body.name || body.name.trim().length < 2) {
    return "Please enter your full name.";
  }
  if (!body.email || !EMAIL_RE.test(body.email.trim())) {
    return "Please enter a valid email address.";
  }
  if (!body.phone || !/^[0-9+\-\s()]{7,15}$/.test(body.phone.trim())) {
    return "Please enter a valid phone number.";
  }
  if (!body.profession || !PROFESSIONS.includes(body.profession as Profession)) {
    return "Please select whether you're a working professional or a student.";
  }
  if (!body.course || !COURSES.includes(body.course as Course)) {
    return "Please select a valid course.";
  }
  return null;
}

// POST /api/leads — save a new lead captured from the form
leadsRouter.post("/", async (req: Request, res: Response) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).json({ ok: false, error });
  }

  const { name, email, phone, profession, course } = req.body as LeadPayload;

  try {
    const result = await pool.query(
      `INSERT INTO leads (name, email, phone, profession, course) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [name.trim(), email.trim(), phone.trim(), profession, course]
    );
    return res.status(201).json({ ok: true, lead: result.rows[0] });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to insert lead:", err);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

// GET /api/leads — list leads (protect this route before going to production)
leadsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, profession, course, created_at FROM leads ORDER BY created_at DESC LIMIT 200`
    );
    return res.json({ ok: true, leads: result.rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch leads:", err);
    return res.status(500).json({ ok: false, error: "Could not fetch leads." });
  }
});
