import HeartSolid from "../../icons/heart-solid-full.svg?react";
import Heart from "../../icons/heart-regular-full.svg?react";
import Plus from "../../icons/plus-solid-full.svg?react";
import {getFavourites} from "@/Api/movies.jsx";
import UserContext from "@/context/UserContext.jsx";
import {useContext, useEffect, useState} from "react";
import {usePage} from "@inertiajs/react";

export const CardList = ({renderFavourites = false}) => {
    const {
        handleFavourite,
        favourites,
        handleSetFavourites,
        mediaList,
        setMediaList
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
        renderFavourites && setMediaList(favourites);
    }, [renderFavourites, favourites]);

    return (
        <div className={"search-results flex flex-col"}>
            {mediaList?.length > 1 && (
                mediaList.map(media => (
                    <div key={media.id} className={"media-card border rounded-lg flex flex-row gap-5 p-8 m-4"}>
                        <img alt="media poster" className={"w-32 h-48"}
                             src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : "/images/placeholder.svg"}/>
                        <div className={"basis-2/3"}>
                            <h2>{media["title"]}</h2>
                            <h3>{media.release_date}</h3>
                            <p>{media.overview}</p>
                            <div className={"interact flex"}>
                                <a onClick={() => handleFavourite(media)} href={"#"}>
                                    {media.is_favourited ? (
                                        <HeartSolid className={"w-6 h-6 icon heart"}/>
                                    ) : (
                                        <Heart className={"w-6 h-6 icon heart"}/>
                                    )}
                                </a>
                                {/*<a href={"#"}><Plus className={"w-6 h-6 icon plus"}/></a>*/}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
