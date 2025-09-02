import { Link } from '@inertiajs/react';

// Helper function to handle page navigation via Inertia
const handlePageChange = (newPage) => {
    router.visit(route('favourites', { page: newPage }), {
        preserveState: true,
        preserveScroll: true,
    });
};

const Pagination = ({ page, totalPages }) => {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-8 space-x-2">
            {page > 1 && (
                <button
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    Previous
                </button>
            )}
            {pages.map((p) => (
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
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default Pagination;
