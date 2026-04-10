# planets/@model/default.js

```text
export default function PlanetModelPage() {
        return (
            <div className="mx-auto p-4">
                <h1 className="text-2xl text-red-600 font-bold mb-4">Planet DEFAULT Model Page</h1>
                <p>This is the Planet Model page. Interested in learning more about it?</p>
                <p>Use this page to test and experiment with the Planet Model component.</p>
            </div>
        );
}  
```

---

# planets/@model/page.js

```text
export default function PlanetModelPage() {
        return (
            <div className="mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Planet Model Page</h1>
                <p>This is the Planet Model page. Interested in learning more about it?</p>
                <p>Use this page to test and experiment with the Planet Model component.</p>
            </div>
        );
}  
```

---

# planets/@model/[id]/page.js

```text
export default async function PlanetDetails({ params }) {
    const { id } = await params;

    return (
        <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Paraller Planet #{id}</h1>
            <p>This page displays details about a specific planet.</p>
            <p>Use this page to test and experiment with the Planet Details component.</p>
        </div>
    );
}
```

---

# planets/layout.js

```text
export default function PlantetsLayout({ children, model }) {
    return (
        <div className="mx-auto p-4">
            {children}
            {model}
        </div>
    );
}
```

---

# planets/page.js

```text
import Link from "next/link";

export default async function PlanetPage() {
    // Array with 10 integers
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Planet Page</h1>
            <p className="mx-auto p-4 text-center">
                This is the Planet page. Use this page to test and experiment with the Planet component.
            </p>
            {"Render a list of numbers from 1 to 10: using Link"}
            <ul className="list-disc list-inside">
                {numbers.map((number) => (
                    <li key={number} className="text-lg">
                        <Link href={`/practice/planets/${number}`} className="text-blue-500 hover:underline">
                            {`Planet ${number}`} </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
```

---

# planets/[id]/page.js

```text
export default async function PlanetDetails({ params }) {
    const { id } = await params;

    return (
        <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Planet #{id}</h1>
            <p>This page displays details about a specific planet.</p>
            <p>Use this page to test and experiment with the Planet Details component.</p>
        </div>
    );
}
```

---

