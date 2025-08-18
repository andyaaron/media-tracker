import {usePage} from "@inertiajs/react";

export const favourite = async (media, tmdb_account_id) => {
    console.log("media: ", media)
    // setError(null)
    const searchParams = new URLSearchParams({
        media_id: media.id,
        media_type: media.media_type,
        favorite: true,
        account_id: tmdb_account_id
    })
    try {
        const response = await fetch(`/api/favourite?${searchParams}`, {
            method: "POST"
        })
        const data = await response.json();

        if(!response.ok) {
            throw data;
        }
        console.log("favourite data: ", data)

        // @TODO: update the local state immediately when favouriting
        // setFavourites(prevFavourites => [...prevFavourites, newFavourite])

    } catch (error) {
        console.error("Error adding a favourite: ", error);
        // setError(error)
    }
}

export const getFavourites = async (tmdb_account_id) => {
    const searchParams = new URLSearchParams({
        account_id: tmdb_account_id
    })
    try {
        const response = await fetch(`/api/favourite_movies?${searchParams}`);
        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data.results

        console.log("getFavourites data: ", data);
    } catch (error) {
        console.error("Error getting favourite movies: ", error);
        setError(error)
    }
}

export const search = async (query, favourites) => {
    try {
        const response = await fetch('/api/search/multi?' + new URLSearchParams({ query: query }))
            .then(response => response.json())
        if (response.results) {
            // add an is_favourited bool to check if media is already liked.
            return hasUserLikedMedia(response.results, favourites)
        }
    } catch (error) {
        console.error("Error fetching media:", error);
        return [];
    }
}

const hasUserLikedMedia = (list, favourites) => {
    console.log("list: ", list);
    console.log("favourites: ", favourites);
    const favouriteIds = new Set(favourites.map(item => item.id));

    return list.map(mediaItem => {
        const isFavourited = favouriteIds.has(mediaItem.id);

        return {
            ...mediaItem,
            is_favourited: isFavourited
        }
    })
}
