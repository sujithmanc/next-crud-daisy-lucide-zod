import { documentContents, documentsWithTagsView } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import db from "@/drizzle";



export default async function PromptBoxPage() {
    // You're code here
    const data = await db.select().from(documentContents);
   
    return (
        <div className="max-w-4xl mx-auto p-4">
            <pre>{JSON.stringify(data, null, 2)}</pre>
   
        </div>
    );
}