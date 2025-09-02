import {useContext, useEffect, useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import {useCustomJiti} from "tailwindcss/src/lib/load-config.js";
import {CardList} from "@/Components/CardList.jsx";
import userContext from "@/context/UserContext.jsx";

export const ErrorHandler = ({error, status_code, status_message}) => (
    <div className={"error-container text-white bg-red-400 m-2 p-2 rounded-md text-center"}>
        <p>{error}</p>
        <p>status code: {status_code}</p>
        <p>status message: {status_message}</p>
    </div>
)

const Search = ({ results }) => {
    // state
    const [error, setError] = useState(null);

    if (!results) {
        return (
            <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Search Results
                </h2>
            }
        >
            <Head title="Search Results" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <p>No search results found!</p>
                </div>
            </div>
        </AuthenticatedLayout>
        )
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Search Results
                </h2>
            }
        >
            <Head title="Search Results" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {error && <ErrorHandler {...error} />}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <CardList renderFavourites={false} results={results} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Search;
