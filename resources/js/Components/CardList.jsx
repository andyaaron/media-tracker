import HeartSolid from "../../icons/heart-solid-full.svg?react";
import Heart from "../../icons/heart-regular-full.svg?react";
import Plus from "../../icons/plus-solid-full.svg?react";
import {getFavourites} from "@/Api/movies.jsx";
import UserContext from "@/context/UserContext.jsx";
import {useContext, useEffect, useState} from "react";
import {usePage} from "@inertiajs/react";

export const CardList = ({renderFavourites = false, results}) => {
    const {
        handleFavourite,
        favourites,
        handleSetFavourites,
        mediaList,
        setMediaList,
        genres,
    } = useContext(UserContext);
    const { tmdb_account_id } = usePage().props.auth.user;

    useEffect(() => {
        const fetchFavourites = async () => {
            const results = await getFavourites(tmdb_account_id, favourites);
            handleSetFavourites(results)
        }
        fetchFavourites();
    }, []);

    useEffect(() => {
        if (results) setMediaList(results)
    }, [results])


    useEffect(() => {
        renderFavourites && setMediaList(favourites);
    }, [renderFavourites, favourites]);

    const moviesWithGenres = mediaList?.map(movie => {
        if(genres?.size > 0) {
            const idToGenre = movie.genre_ids?.map(id => genres.get(id));
            return {...movie, genres: idToGenre};
        }
        return {...movie}
    })

    return (
        <div className={"search-results flex flex-col"}>
            {moviesWithGenres?.length > 1 && (
                moviesWithGenres.map(media => {
                    const is_favourited = favourites.some(fav => fav.id === media.id)
                    return (
                        <div key={media.id} className={"media-card border rounded-lg flex flex-row gap-5 p-8 m-4"}>
                            <img alt="media poster" className={"w-32 h-48"}
                                 src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : "/images/placeholder.svg"}/>
                            <div className={"basis-2/3"}>
                                <h2>{media.title || media.name}</h2>
                                <h3>{media.release_date}</h3>
                                <h3>{media.genres?.map(String).join(', ')}</h3>
                                <p>{media.overview}</p>
                                <div className={"interact flex"}>
                                    <a onClick={() => handleFavourite(media)} href={"#"}>
                                        {is_favourited ? (
                                            <HeartSolid className={"w-6 h-6 icon heart"}/>
                                        ) : (
                                            <Heart className={"w-6 h-6 icon heart"}/>
                                        )}
                                    </a>
                                    {/*<a href={"#"}><Plus className={"w-6 h-6 icon plus"}/></a>*/}
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}
