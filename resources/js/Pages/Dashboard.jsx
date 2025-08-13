import {useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Heart from '/resources/icons/heart-regular-full.svg?react';
import Plus from '/resources/icons/plus-solid-full.svg?react';
import Check from '/resources/icons/check-solid-full.svg?react';

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
                        <div className={"flex flex-row justify-center items-center"}>
                            <input className="m-4" type={"text"} placeholder={"Search for a movie... "} onChange={handleChange}/>
                            <button className={"border p-1 rounded-lg bg-blue-500 text-white font-bold"} onClick={handleClick}>Submit</button>
                        </div>
                        <div className={"search-results flex flex-col"}>
                            {movies?.length > 1 && (
                                movies.map(movie => (
                                        <div key={movie.id} className={"movie-card border rounded-lg flex flex-row gap-5 p-8 m-4"}>
                                            <img alt="movie poster" className={"w-32 h-48"} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                                            <div className={"basis-2/3"}>
                                                <h2>{movie["title"]}</h2>
                                                <h3>{movie.release_date}</h3>
                                                <p>{movie.overview}</p>
                                                <div className={"interact flex"}>
                                                    <a href={"#"}><Heart className={"w-6 h-6 icon heart"}/></a>
                                                    <a href={"#"}><Plus className={"w-6 h-6 icon plus"}/></a>
                                                </div>
                                            </div>
                                        </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
