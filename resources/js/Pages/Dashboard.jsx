import {useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);

    const search = async () => {
        try {
            const response = await fetch('/api/search/movies?' + new URLSearchParams({ query: query }))
                .then(response => response.json())
            if (response.results) {
                setMovies(response.results);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            setMovies([])
        }
    }

    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const handleClick = async () => {
        await search(query)
    }

    console.log(movies)
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
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                        <input type={"text"} placeholder={"Search for a movie... "} onChange={handleChange}/>
                        <button onClick={handleClick}>Submit</button>

                        <div className={"search-results"}>
                            {movies?.length > 1 && (
                                movies.map(movie => (
                                        <div>{movie["title"]}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
