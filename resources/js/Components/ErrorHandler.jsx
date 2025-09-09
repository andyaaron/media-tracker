import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";

export const ErrorHandler = ({error, status_code, status_message}) => (
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
                <div className="overflow-hidden bg-red-400 shadow-sm sm:rounded-lg">
                    <p>Oops! Something went wrong...</p>
                    <p>Error: {error}</p>
                    <p>status_code: {status_code}</p>
                    <p>status_message: {status_message}</p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
)
