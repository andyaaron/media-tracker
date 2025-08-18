import HeartSolid from "../../icons/heart-solid-full.svg?react";
import Heart from "../../icons/heart-regular-full.svg?react";
import Plus from "../../icons/plus-solid-full.svg?react";
import {favourite} from "@/Api/movies.jsx";

export const Card = ({media, tmdb_account_id}) => {
    const handleFavourite = async (media) => {
        await favourite(media, tmdb_account_id)
    }
    console.log("media: ", media);
    return (
        <div className={"media-card border rounded-lg flex flex-row gap-5 p-8 m-4"}>
            <img alt="media poster" className={"w-32 h-48"}
                 src={`https://image.tmdb.org/t/p/w500/${media.poster_path}`}/>
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
                    <a href={"#"}><Plus className={"w-6 h-6 icon plus"}/></a>
                </div>
            </div>
        </div>
    )
}
