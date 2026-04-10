
export default function PracticeDemo({ children, model }) {
    return (
        <div className="m-2 p-4 border-2 rounded-3xl border-amber-500">
            <h1 className="text-2xl font-bold mb-4">Practice Demo Layout</h1>
            {children}
            <div className="m-2 p-4 border-4 rounded-3xl border-red-500">
                {model}
            </div>
        </div>
    );
}