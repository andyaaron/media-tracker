import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";
import {CardList} from "@/Components/CardList.jsx";
import UserContext from "@/context/UserContext.jsx";
import {useContext} from "react";
import {ErrorHandler} from "@/Components/ErrorHandler.jsx";

export default function Favourites({ results, page, total_pages, total_results, status_code, status_message, error }) {
    const { genres } = useContext(UserContext);

    console.log("results: ", results);

    if (error) {
        return <ErrorHandler {...error} />
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Favourites
                </h2>
            }
        >
            <Head title={"Favourites"} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <CardList results={results} page={page} totalPages={total_pages} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
