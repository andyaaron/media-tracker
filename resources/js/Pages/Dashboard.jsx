import { useState} from "react";
import {Head} from '@inertiajs/react';
import {useCustomJiti} from "tailwindcss/src/lib/load-config.js";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {ErrorHandler} from "@/Components/ErrorHandler.jsx";
import {GraphContainer} from "@/Components/Graphs/GraphContainer.jsx";
import ForceGraph from "@/Components/Graphs/ForceGraph.jsx";
import PieGraph from "@/Components/Graphs/PieGraph.jsx";

export default function Dashboard() {
    // state
    const [error, setError] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Media Tracker
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {error && <ErrorHandler {...error} />}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-row">
                            <GraphContainer title={"Favourited movies by genre"}>
                                <ForceGraph />
                            </GraphContainer>
                            {/*<GraphContainer title={"Genre Breakdown"}>*/}
                            {/*    <PieGraph />*/}
                            {/*</GraphContainer>*/}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
