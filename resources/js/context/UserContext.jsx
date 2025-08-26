import {createContext, useState} from "react";
import {favourite, search} from "@/Api/movies.jsx";

const UserContext = createContext({});

const UserProvider = (props) => {
    const [favourites, setFavourites] = useState([])

    const { tmdb_account_id } = props

    const handleFavourite = async (media) => {
        console.log("test test testtttt")
        const data = await favourite(media, tmdb_account_id)
        console.log("data: ", data);
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
    }} />
}

export default UserContext;

export { UserProvider }
