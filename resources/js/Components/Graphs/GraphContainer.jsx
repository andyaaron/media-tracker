import {useContext, useEffect} from "react";
import UserContext from "@/context/UserContext.jsx";
import {usePage} from "@inertiajs/react";
import ForceGraph from "@/Components/Graphs/ForceGraph.jsx";
import {getFavourites} from "@/Api/movies.jsx";

export const GraphContainer = ({ title, children }) => {
    return (
        <div className={"m-4 "}>
            <h2>{title}</h2>
            <div className={"w-100 border border-solid border-2 rounded-md overflow-hidden"}>
                {children}
            </div>
        </div>
    )
}
