import {createContext, useEffect, useState} from "react";
import {favourite, getGenres} from "@/Api/movies.jsx";

const UserContext = createContext({});

const UserProvider = (props) => {
    const [favourites, setFavourites] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [genres, setGenres] = useState(null);

    const { tmdb_account_id } = props

    useEffect(() => {
        const fetchGenres = async () => {
            const results = await getGenres();
            // convert array of objects to a map for faster searching
            const genreMap = new Map(results.map((genre) => [genre.id, genre.name]));
            setGenres(genreMap);
        }
        fetchGenres();
        }, []);

    const handleFavourite = async (media) => {
        const isFavourited = favourites.some(fav => fav.id === media.id)

        if (isFavourited) {
            setFavourites(prevFavourites => prevFavourites.filter(fav => fav.id !== media.id))
            // @TODO: make api call to remove favourite from db
        } else {
            const data = await favourite(media, tmdb_account_id)
            setFavourites(prevFavourites => [...prevFavourites, data]);
        }
    }

    const handleSetFavourites = (value) => {
        setFavourites(value)
    }

    return <UserContext.Provider {...props} value={{
        tmdb_account_id,
        handleFavourite,
        handleSetFavourites,
        favourites,
        setFavourites,
        genres,
        mediaList,
        setMediaList,
    }} />
}

export default UserContext;

export { UserProvider }
