import Link from "next/link";

export default async function PlanetDetails({ params }) {
    const { id } = await params;

    return (
        <div className="mx-auto p-4">
            <Link href="/practice/planets/help" className="text-blue-500 hover:underline mb-4 inline-block">
                Help
            </Link>
            <h1 className="text-2xl font-bold mb-4">Planet #{id}</h1>
            <p>This page displays details about a specific planet.</p>
            <p>Use this page to test and experiment with the Planet Details component.</p>
        </div>
    );
}