import {useContext, useEffect, useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import Check from '/resources/icons/check-solid-full.svg?react';
import UserContext from "@/context/UserContext.jsx";
import {useCustomJiti} from "tailwindcss/src/lib/load-config.js";
import {Card} from "@/Components/Card.jsx";
import {favourite, getFavourites, search} from "@/Api/movies.jsx";


export const ErrorHandler = ({error, status_code, status_message}) => (
    <div className={"error-container text-white bg-red-400 m-2 p-2 rounded-md text-center"}>
        <p>{error}</p>
        <p>status code: {status_code}</p>
        <p>status message: {status_message}</p>
    </div>
)

export default function Dashboard() {
    // state
    const [query, setQuery] = useState('');
    const [mediaList, setMediaList] = useState([]);
    const [error, setError] = useState(null);
    const [favourites, setFavourites] = useState([]);

    // vars
    const { tmdb_account_id } = usePage().props.auth.user

    useEffect(() => {
        const fetchFavourites = async () => {
            const results = await getFavourites(tmdb_account_id);
            console.log("results: ", results);
            setFavourites(results)
        }
        fetchFavourites();
    }, []);

    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const handleClick = async () => {
        const searchResults = await search(query, favourites)
        setMediaList(searchResults)
    }

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
                        <div className={"flex flex-row justify-center items-center"}>
                            <input className="m-4" type={"text"} placeholder={"Search for a movie... "} onChange={handleChange}/>
                            <button className={"border p-1 rounded-lg bg-blue-500 text-white font-bold"} onClick={handleClick}>Submit</button>
                        </div>
                        <div className={"search-results flex flex-col"}>
                            {mediaList?.length > 1 && (
                                mediaList.map(media => (
                                    <Card media={media} key={media.id} tmdb_account_id={tmdb_account_id} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
