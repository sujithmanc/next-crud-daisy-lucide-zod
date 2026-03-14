import { mysqlTable as table } from "drizzle-orm/mysql-core";
import {
    mysqlTable,
    serial,
    varchar,
    date,
    mysqlEnum,
    json,
    timestamp,
} from "drizzle-orm/mysql-core";

export const userRoles = ["guest", "user", "admin"];
export const genderType = ["Male", "Female", "Other"];

export const users = table("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    dob: date("dob"),
    gender: mysqlEnum("gender", genderType),
    role: mysqlEnum("role", userRoles).default("guest"),
    skills: json("skills").$type(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});