import {useContext} from "react";
import {Link, router} from '@inertiajs/react';
import UserContext from "@/context/UserContext.jsx";

// Helper function to handle page navigation via Inertia
const handlePageChange = (newPage, query) => {
    const data = {
        ...(query && {query: query}),
        page: newPage
    }
    router.get(route().current(), data, {
        preserveState: true,
        preserveScroll: true,
    });
};

const Pagination = ({ page, totalPages }) => {
    if (totalPages <= 1) {
        return null;
    }

    const { query } = useContext(UserContext)

    const pages = [];
    let currentPages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    if (pages.length > 2) {
       currentPages = pages.slice(page-1, page+10)
    }

    return (
        <div className="flex justify-center mt-8 space-x-2 m-4">
            {page > 1 && (
                <button
                    onClick={() => handlePageChange(page - 1, query)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    Previous
                </button>
            )}
            {currentPages.map((p) => (
                <Link
                    key={p}
                    href={route('favourites', { page: p })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        p === page ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    preserveState={true}
                >
                    {p}
                </Link>
            ))}
            {page < totalPages && (
                <button
                    onClick={() => handlePageChange(page + 1, query)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default Pagination;
