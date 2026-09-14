import { FormEvent, useState } from "react";

const COURSES = ["CI/CD", "Cloud & AWS", "Docker & Kubernetes", "Monitoring"] as const;
const PROFESSIONS = ["Working professional", "Student"] as const;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

type Status = { type: "idle" | "success" | "error"; message?: string };

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  profession?: string;
  course?: string;
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) next.phone = "Enter a valid phone number.";
    if (!profession) next.profession = "Select whether you're working or studying.";
    if (!course) next.course = "Select a course.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          profession,
          course,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
        return;
      }

      setStatus({ type: "success", message: "Thanks! We'll reach out on your phone number shortly." });
      setName("");
      setEmail("");
      setPhone("");
      setProfession("");
      setCourse("");
      setErrors({});
    } catch {
      setStatus({
        type: "error",
        message: "Could not reach the server. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section container reveal" id="contact">
      <div className="contact-grid">
        <div className="contact-info">
          <div className="section-head">
            <h2>Get course details</h2>
            <p>Share your details and we'll follow up with batch timings and pricing.</p>
          </div>
          <div className="contact-address">
            <span>Address</span>
            <strong>Bengaluru, Karnataka</strong>
          </div>
          <div className="contact-address">
            <span>Email</span>
            <strong>hello@cloudorbit.fun</strong>
          </div>
          <div className="contact-address">
            <span>Response time</span>
            <strong>Within 24 hours, Mon–Sat</strong>
          </div>

          <div className="contact-steps">
            <h3>What happens next</h3>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <strong>We call you back</strong>
                  <p>A mentor reaches out within a day to understand your goals and experience.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Pick a batch</strong>
                  <p>Choose a cohort start date and track that fits your schedule.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Start learning</strong>
                  <p>Join live sessions, hands-on labs, and 1:1 mentor reviews from day one.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <form className="lead-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          <div className="field">
            <label htmlFor="profession">You are a</label>
            <select id="profession" value={profession} onChange={(e) => setProfession(e.target.value)}>
              <option value="" disabled>
                Select one
              </option>
              {PROFESSIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.profession && <div className="field-error">{errors.profession}</div>}
          </div>

          <div className="field">
            <label htmlFor="course">Course interested</label>
            <select id="course" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="" disabled>
                Select a course
              </option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.course && <div className="field-error">{errors.course}</div>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Submitting…" : "Request course details"}
          </button>

          {status.type !== "idle" && (
            <div className={`form-status ${status.type}`}>{status.message}</div>
          )}
        </form>
      </div>
    </section>
  );
}
