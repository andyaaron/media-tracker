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

        return data;
        // @TODO: update the local state immediately when favouriting
        // setFavourites(prevFavourites => [...prevFavourites, newFavourite])

    } catch (error) {
        console.error("Error adding a favourite: ", error);
        // setError(error)
    }
}

export const getFavourites = async (tmdb_account_id, favourites) => {
    const searchParams = new URLSearchParams({
        account_id: tmdb_account_id
    })
    try {
        const response = await fetch(`/api/favourite_movies?${searchParams}`)
            .then(response => response.json())

        if (response.results) {
            return response.results
        }
    } catch (error) {
        console.error("Error getting favourite movies: ", error);
        return error
    }
}

export const getGenres = async () => {
    try {
        const response = await fetch('/api/genres')
            .then(response => response.json())

        if (response.results) {
            return response.results
        }
    } catch (error) {
        console.error("Error getting movie genres: ", error)
        return error;
    }
}

export const search = async (query, favourites, tmdb_account_id) => {
    const searchParams = new URLSearchParams({
        account_id: tmdb_account_id,
        query: query
    })
    try {
        const response = await fetch(`/api/search/multi?${searchParams}`)
            .then(response => response.json())

        return response.results
    } catch (error) {
        console.error("Error fetching media:", error);
        return [];
    }
}
