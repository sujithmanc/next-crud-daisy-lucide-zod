import db from "@/drizzle";
import { nodes } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { Home, FolderOpen, Plus, Search, ChevronRight } from "lucide-react";
import NodeRow from "./NodeRow";

export default async function BrowsePrompts({ searchParams }) {
    const params = await searchParams;
    const currentFolderId = params.folderId ? parseInt(params.folderId) : 1;

    // 1. Fetch Breadcrumbs using Recursive CTE
    const result = await db.execute(sql`
  WITH RECURSIVE path_cte AS (
    SELECT id, name, parent_id
    FROM nodes
    WHERE id = ${currentFolderId}
    UNION ALL
    SELECT n.id, n.name, n.parent_id
    FROM nodes n
    INNER JOIN path_cte p ON p.parent_id = n.id
  )
  SELECT id, name FROM path_cte
`);

    // Handle different driver response structures
    const rows = Array.isArray(result) ? result : (result.rows || []);
    const breadcrumbPath = [...rows].reverse();

    // 2. Fetch Child Nodes
    const childNodes = await db.select()
        .from(nodes)
        .where(eq(nodes.parentId, currentFolderId));

    // 3. Sort (Folders first, then A-Z)
    const sortedNodes = [...childNodes].sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
    });

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen font-sans">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary text-primary-content rounded-2xl shadow-xl shadow-primary/20">
                            <FolderOpen size={28} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Browse</h1>
                    </div>

                    {/* Breadcrumbs UI */}
                    <nav className="text-sm breadcrumbs bg-base-200/50 px-4 py-2 rounded-full border border-base-300 inline-block">
                        <ul className="flex items-center">
                            <li>
                                <Link href="/promptbox/browse" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Home size={14} />
                                    <span className="hidden sm:inline">Root</span>
                                </Link>
                            </li>
                            {breadcrumbPath.map((crumb, idx) => {
                                if (crumb.id === 1 && idx === 0) return null; // Avoid double Root
                                return (
                                    <li key={crumb.id} className="flex items-center gap-2">
                                        <ChevronRight size={12} className="opacity-30" />
                                        <Link
                                            href={`/promptbox/browse?folderId=${crumb.id}`}
                                            className={`hover:text-primary transition-colors ${crumb.id === currentFolderId ? "font-bold text-base-content" : ""
                                                }`}
                                        >
                                            {crumb.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-primary shadow-lg gap-2">
                        <Plus size={18} /> New Item
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200/50 border-b border-base-300">
                            <th className="py-5 px-6 font-bold uppercase text-[11px] tracking-widest opacity-50">Name</th>
                            <th className="hidden md:table-cell font-bold uppercase text-[11px] tracking-widest opacity-50">Modified</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200">
                        {sortedNodes.map((node) => (
                            <NodeRow key={node.id} node={node} />
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {sortedNodes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 opacity-30">
                        <FolderOpen size={64} strokeWidth={1} />
                        <p className="mt-4 font-medium italic">This folder is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}