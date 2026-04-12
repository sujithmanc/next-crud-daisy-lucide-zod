import Link from "next/link";

export default function PlanetsPage() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
        <>
            
            <Link href="/practice/cats/help" className="text-blue-500 hover:underline mb-4 inline-block">
                Help
            </Link>
            <Link href="/practice/cats/about" className="text-blue-500 hover:underline mb-4 inline-block">
                About
            </Link>
            <ul className="list-disc list-inside">
                {numbers.map((number) => (
                    <li key={number} className="text-lg">
                        <Link href={`/practice/cats/list/${number}`} className="text-blue-500 hover:underline">
                            Cat {number}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}