import {
  mysqlTable,
  bigint,
  varchar,
  text,
  date,
  timestamp,
  index,
  unique,
  mysqlView,
} from "drizzle-orm/mysql-core";
import { eq, relations, sql } from "drizzle-orm";

// ─── Topics ──────────────────────────────────────────────────────────────────

export const topics = mysqlTable("topics", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (t) => [
  unique("topics_name_unique").on(t.name),
]);

// ─── Subtopics ────────────────────────────────────────────────────────────────

export const subtopics = mysqlTable("subtopics", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  topicId: bigint("topic_id", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (t) => [
  index("idx_subtopics_topic").on(t.topicId),
  unique("subtopics_topic_name_unique").on(t.topicId, t.name), // prevent duplicate subtopic names within a topic
]);

// ─── QA Notes ─────────────────────────────────────────────────────────────────

export const qaNotes = mysqlTable("qa_notes", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
  que: text("que").notNull(),
  ans: text("ans").notNull(),
  topicId: bigint("topic_id", { mode: "number", unsigned: true }).notNull(),
  subtopicId: bigint("subtopic_id", { mode: "number", unsigned: true }),
  noteDate: date("note_date").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
}, (t) => [
  index("idx_notes_topic_date").on(t.topicId, t.noteDate), // composite — most frequent query
  index("idx_notes_date").on(t.noteDate),
  index("idx_notes_subtopic").on(t.subtopicId),
]);

// ─── Relations ────────────────────────────────────────────────────────────────

export const topicsRelations = relations(topics, ({ many }) => ({
  subtopics: many(subtopics),
  qaNotes:   many(qaNotes),
}));

export const subtopicsRelations = relations(subtopics, ({ one, many }) => ({
  topic:   one(topics,  { fields: [subtopics.topicId],  references: [topics.id] }),
  qaNotes: many(qaNotes),
}));

export const qaNotesRelations = relations(qaNotes, ({ one }) => ({
  topic:    one(topics,    { fields: [qaNotes.topicId],    references: [topics.id] }),
  subtopic: one(subtopics, { fields: [qaNotes.subtopicId], references: [subtopics.id] }),
}));

export const notesView = mysqlView("v_notes").as((qb) =>
  qb
    .select({
      noteId:       qaNotes.id,
      topicId:      qaNotes.topicId,
      subtopicId:   qaNotes.subtopicId,
      topicName:    sql`${topics.name}`.as("topic_name"),      // ← alias
      subtopicName: sql`${subtopics.name}`.as("subtopic_name"), // ← alias
      que:          qaNotes.que,
      ans:          qaNotes.ans,
      noteDate:     qaNotes.noteDate,
      createdAt:    qaNotes.createdAt,
    })
    .from(qaNotes)
    .innerJoin(topics,   eq(qaNotes.topicId,    topics.id))
    .leftJoin(subtopics, eq(qaNotes.subtopicId, subtopics.id))
);