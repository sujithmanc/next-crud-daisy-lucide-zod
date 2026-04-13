import { notesView, subtopics, topics } from "@/drizzle/schema";
import db from "@/drizzle";
import { and, asc, count, eq } from "drizzle-orm";

export async function getTopics() {
    return await db.query.topics.findMany()
}

export async function getSubtopics(topicId) {
    if (!topicId) {
        return db.query.subtopics.findMany();
    }
    return db.query.subtopics.findMany({
        where: eq(subtopics.topicId, topicId),
        orderBy: asc(subtopics.name),
    });
}

export async function getTopicsWithSubtopics() {
    const rows = await db
        .selectDistinct({
            topic: notesView.topicName,
            subtopic: notesView.subtopicName,
        })
        .from(notesView)
        .orderBy(notesView.topicName, notesView.subtopicName);

    // Group subtopics under each topic
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

export async function getTopicsWithSubtopicsV2() {
    const rows = await db
        .select({
            topic: topics.name,
            topicId: topics.id,
            subtopic: subtopics.name,
            subtopicId: subtopics.id,
        })
        .from(topics)
        .leftJoin(subtopics, eq(subtopics.topicId, topics.id))
        .orderBy(topics.name, subtopics.name);

    const map = {};
    for (const row of rows) {
        if (!map[row.topicId]) {
            map[row.topicId] = { topic: row.topic, subtopics: [] };
        }
        if (row.subtopicId) {
            map[row.topicId].subtopics.push(row.subtopic);
        }
    }

    return Object.values(map);
}

export async function getTopicMetrics(date = null) {
    const conditions = date ? eq(notesView.noteDate, date) : undefined;

    const rows = await db
        .select({
            topic: notesView.topicName,
            count: count(),
        })
        .from(notesView)
        .where(conditions)
        .groupBy(notesView.topicName)
        .orderBy(notesView.topicName);

    return rows;
}

export async function getSubtopicMetrics(date = null, topic = null) {
    const conditions = [];

    if (date) conditions.push(eq(notesView.noteDate, date));

    if (topic !== null) {
        if (typeof topic === "string") {
            conditions.push(eq(notesView.topicName, topic));
        } else if (typeof topic === "number") {
            conditions.push(eq(notesView.topicId, topic));
        }
    }

    const rows = await db
        .select({
            subtopicId: notesView.subtopicId,
            subtopicName: notesView.subtopicName,
            count: count(),
        })
        .from(notesView)
        .where(conditions.length ? and(...conditions) : undefined)
        .groupBy(notesView.subtopicId)
        .orderBy(notesView.subtopicName);

    return rows;
}


export async function getTopicsWithSubtopicsV3(date = null) {
    const rows = await db
        .selectDistinct({
            topic: notesView.topicName,
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