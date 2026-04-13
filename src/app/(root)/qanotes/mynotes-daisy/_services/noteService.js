import { count, eq, and, inArray, asc } from "drizzle-orm";
import { notesView, topics, subtopics } from "@/drizzle/schema";
import db from "@/drizzle";

// ─── Topics ───────────────────────────────────────────────────────────────────

export async function getTopics() {
  return await db.query.topics.findMany({
    orderBy: asc(topics.name),
  });
}

// ─── Subtopics ────────────────────────────────────────────────────────────────

export async function getSubtopics(topicId) {
  return await db.query.subtopics.findMany({
    where: eq(subtopics.topicId, topicId),
    orderBy: asc(subtopics.name),
  });
}

// ─── Topics with subtopics (for filter accordion) ─────────────────────────────

export async function getTopicsWithSubtopics(date = null) {
  const rows = await db
    .selectDistinct({
      topic:    notesView.topicName,
      subtopic: notesView.subtopicName,
    })
    .from(notesView)
    .where(date ? eq(notesView.noteDate, date) : undefined)
    .orderBy(notesView.topicName, notesView.subtopicName);

  const map = {};
  for (const row of rows) {
    if (!map[row.topic]) map[row.topic] = [];
    if (row.subtopic) map[row.topic].push(row.subtopic);
  }

  return Object.entries(map).map(([topic, subtopics]) => ({
    topic,
    subtopics,
  }));
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function getNotes({ date = null, topics = [], subtopics = [] } = {}) {
  const conditions = [];

  if (date)           conditions.push(eq(notesView.noteDate,    date));
  if (topics.length)  conditions.push(inArray(notesView.topicName,    topics));
  if (subtopics.length) conditions.push(inArray(notesView.subtopicName, subtopics));

  return await db
    .select()
    .from(notesView)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(notesView.topicName, notesView.noteDate, notesView.noteId);
}

// ─── Topic metrics ────────────────────────────────────────────────────────────

export async function getTopicMetrics(date = null) {
  return await db
    .select({ topic: notesView.topicName, count: count() })
    .from(notesView)
    .where(date ? eq(notesView.noteDate, date) : undefined)
    .groupBy(notesView.topicName)
    .orderBy(notesView.topicName);
}

// ─── Subtopic metrics ─────────────────────────────────────────────────────────

export async function getSubtopicMetrics(date = null, topic = null) {
  const conditions = [];
  if (date) conditions.push(eq(notesView.noteDate, date));
  if (topic !== null) {
    if (typeof topic === "string") conditions.push(eq(notesView.topicName, topic));
    else if (typeof topic === "number") conditions.push(eq(notesView.topicId, topic));
  }

  return await db
    .select({
      subtopicId:   notesView.subtopicId,
      subtopicName: notesView.subtopicName,
      count:        count(),
    })
    .from(notesView)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(notesView.subtopicId)
    .orderBy(notesView.subtopicName);
}
