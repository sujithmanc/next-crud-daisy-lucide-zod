// ─── Date formatting ──────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mmm  = MONTHS[date.getMonth()];
  const dd   = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mmm}-${dd}`;
}

// ─── Slug (for accordion IDs) ─────────────────────────────────────────────────

export function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

// ─── Parse searchParams ───────────────────────────────────────────────────────
// Normalises single string or array for topic / subtopic params

export function parseSearchParams(values = {}) {
  const date = values?.date ?? null;
  const from = values?.from ?? null;
  const to   = values?.to   ?? null;

  // topic and subtopic can be a single string or array — always return array
  const selectedTopics = values?.topic
    ? [].concat(values.topic)
    : [];

  const selectedSubtopics = values?.subtopic
    ? [].concat(values.subtopic)
    : [];

  return { date, from, to, selectedTopics, selectedSubtopics };
}
