
export function UpdateResultsButton({ onClick }) {
    return (
        <div className="sticky bottom-0 mt-auto pt-10 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent">
            <button
                onClick={onClick}
                className="w-full py-3 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-2xl font-bold text-[13px] transition-all duration-200 shadow-sm"
            >
                Update Results
            </button>
        </div>
    );
}