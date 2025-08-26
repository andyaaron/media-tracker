import {useContext, useState} from "react";
import userContext from "@/context/UserContext.jsx";
import {search} from "@/Api/movies.jsx";
export const Search = (props) => {
    const [query, setQuery] = useState('');

    const {
        tmdb_account_id,
        favourites,
        handleMediaList,
    } = useContext(userContext)

    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const handleClick = async () => {
        const searchResults = await search(query, favourites)
        handleMediaList(searchResults)
    }
    return (
        <div className={"flex flex-row justify-center items-center"}>
            <input className="m-4" type={"text"} placeholder={"Search for a movie... "} onChange={handleChange}/>
            <button className={"border p-1 rounded-lg bg-blue-500 text-white font-bold"} onClick={handleClick}>Submit</button>
        </div>
    )
}
