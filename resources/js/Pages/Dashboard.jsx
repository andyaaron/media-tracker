import {useContext, useEffect, useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import Check from '/resources/icons/check-solid-full.svg?react';
import UserContext, {UserProvider} from "@/context/UserContext.jsx";
import {useCustomJiti} from "tailwindcss/src/lib/load-config.js";
import {CardList} from "@/Components/CardList.jsx";
import {favourite, getFavourites, search} from "@/Api/movies.jsx";
import userContext from "@/context/UserContext.jsx";
import {Search} from "@/Components/Search.jsx";


export const ErrorHandler = ({error, status_code, status_message}) => (
    <div className={"error-container text-white bg-red-400 m-2 p-2 rounded-md text-center"}>
        <p>{error}</p>
        <p>status code: {status_code}</p>
        <p>status message: {status_message}</p>
    </div>
)

export default function Dashboard() {
    // state
    const [mediaList, setMediaList] = useState([]);
    const [error, setError] = useState(null);

    const {
        favourites,
        setFavourites,
        handleSetFavourites,
        handleSearch,
    } = useContext(userContext)
    console.log("favourites: ", favourites);

    // vars

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Media Tracker
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {error && <ErrorHandler {...error} />}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <Search />
                        <CardList />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
