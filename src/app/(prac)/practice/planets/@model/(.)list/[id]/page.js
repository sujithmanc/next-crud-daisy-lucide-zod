"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PlanetModal() {
    const router = useRouter();
    const { id } = useParams();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-2">Planet #{id}</h2>
                <p className="text-gray-600 mb-4">
                    This is the intercepted modal. The list page is still in the background.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                    Hard refresh this URL to see the full page version instead.
                </p>
                <button
                    onClick={() => router.back()}
                    className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}