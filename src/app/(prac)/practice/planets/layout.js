export default function PlanetsLayout({ children, model }) {
    return (
        <div className="mx-auto p-4">
            {children}
            {model}
        </div>
    );
}