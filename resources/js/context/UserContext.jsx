import {createContext, useEffect, useState} from "react";
import {favourite, getGenres} from "@/Api/movies.jsx";

const UserContext = createContext({});

const UserProvider = (props) => {
    const [favourites, setFavourites] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [genres, setGenres] = useState([]);

    const { tmdb_account_id } = props

    useEffect(() => {
        const fetchGenres = async () => {
            const results = await getGenres();
            setGenres(results)
        }
        fetchGenres();
        }, []);

    const handleFavourite = async (media) => {
        const data = await favourite(media, tmdb_account_id)
        setFavourites(prevFavourites => [...prevFavourites, data]);
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
