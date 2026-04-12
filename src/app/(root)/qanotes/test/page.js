// page.js

import NotesList from "./NotesList";


export default async function DatePage({ params, searchParams }) {

    const { date } = await searchParams;
    const selected = [];

    return (
        <div className="mx-auto p-4">
            <NotesList date={date} selected={selected} />
        </div>
    );
}