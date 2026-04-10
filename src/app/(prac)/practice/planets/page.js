import Link from "next/link";

export default function PlanetsPage() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Planets</h1>
            <ul className="list-disc list-inside">
                {numbers.map((number) => (
                    <li key={number} className="text-lg">
                        <Link href={`/practice/planets/list/${number}`} className="text-blue-500 hover:underline">
                            Planet {number}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}