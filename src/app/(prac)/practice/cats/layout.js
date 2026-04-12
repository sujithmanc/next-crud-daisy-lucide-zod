export default function PlanetsLayout({ children, model }) {
    return (
        <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">CATS</h1>
            <hr className="my-4" />
            {children}
            {model}
        </div>
    );
}