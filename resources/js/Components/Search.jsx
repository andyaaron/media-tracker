import {useContext, useState} from "react";
import userContext from "@/context/UserContext.jsx";
import {search} from "@/Api/movies.jsx";
import {usePage} from "@inertiajs/react";
export const Search = (props) => {
    const [query, setQuery] = useState('');

    const {
        favourites,
        setMediaList,
    } = useContext(userContext)
    const { tmdb_account_id } = usePage().props.auth.user;
    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const onFormSubmit = e => {
        e.preventDefault();
    }

    const handleClick = async () => {
        const searchResults = await search(query, favourites, tmdb_account_id)
        setMediaList(searchResults)
    }
    return (
        <div className={"flex flex-row justify-center items-center"}>
            <form className={"w-full flex flex-row items-center m-4 gap-4"} onSubmit={onFormSubmit}>
                <input className="flex-1" type={"text"} placeholder={"Search for a movie... "} onChange={handleChange}/>
                <button className={" border p-1 rounded-lg bg-blue-500 text-white font-bold"} onClick={handleClick} type={"submit"}>Submit</button>
            </form>
        </div>
    )
}
