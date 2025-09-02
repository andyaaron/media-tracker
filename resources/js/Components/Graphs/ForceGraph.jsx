import * as d3 from 'd3';
import {useContext, useEffect, useRef} from "react";
import UserContext from "@/context/UserContext.jsx";
import {getFavourites} from "@/Api/movies.jsx";
import {usePage} from "@inertiajs/react";

const ForceGraph = () => {
    const {
        genres,
        favourites,
        handleSetFavourites,
    } = useContext(UserContext);

    const { tmdb_account_id } = usePage().props.auth.user;

    const svgRef = useRef();
    const width = "464";
    const height = "340";

    useEffect(() => {
        return () => {
            if (d3.select(svgRef.current).node()) {
                const simulation = d3.select(svgRef.current).datum()?.simulation;
                if (simulation) {
                    simulation.stop();
                }
            }
        }
    }, []);

    useEffect(() => {
        const fetchFavourites = async () => {
            const results = await getFavourites(tmdb_account_id, favourites);
            handleSetFavourites(results)
        }
        fetchFavourites();
    }, []);

    useEffect(() => {
        if (!favourites || favourites.length == 0 || !genres || genres.size === 0) {
            return;
        }

        // Create the SVG container.
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", "0 0 464 340")
            // .attr("style", "max-width: 100%; height: 1;");

        // clear previous graph
        svg.selectAll('*').remove();

        const nodes = [];
        const links = [];

        // add genre nodes
        for (let [id, name] of genres) {
            nodes.push({ id: `genre-${id}`, name: name, group: 'genre'});
        }

        // add movie nodes and links
        favourites.forEach(movie => {
            // add movie node
            nodes.push({ id: `movie-${movie.id}`, name: movie.original_title, group: 'movie'})

            // add links between the movie and its genres
            if (movie.genre_ids) {
                movie.genre_ids.forEach(genreId => {
                    if (genres.has(genreId)) {
                        links.push({
                            source: `movie-${movie.id}`,
                            target: `genre-${genreId}`
                        })
                    }
                })
            }
        })

        // Specify the color scale.
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create a simulation with several forces.
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(300, 200))
            .force("x", d3.forceX())
            .force("y", d3.forceY());


        // Add a line for each link, and a circle for each node.
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", d => color(d.group));

        const labels = svg.append("g")
            .attr("pointer-events", "none")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("id", d => `label-${d.id}`) // Give each label a unique ID
            .attr("dx", 15)
            .attr("dy", 4)
            .text(d => d.name)
            .style("opacity", 0)

        node.on("mouseover", (event, d) => {
            // hide label when mouse moves out
            d3.select(`#label-${d.id}`)
                .transition()
                .duration(200)
                .style("opacity", 1)
        }).on("mouseout", (event, d) => {
            // hide label when mouse moves out
            d3.select(`#label-${d.id}`)
                .transition()
                .duration(200)
                .style("opacity", 0)
        })


        node.append("title")
            .text(d => d.id);

        // Add a drag behavior.
        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Set the position attributes of links and nodes each time the simulation ticks.
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y)
        });

        // Reheat the simulation when drag starts, and fix the subject position.
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        // Update the subject (dragged node) position during drag.
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        // Restore the target alpha so the simulation cools after dragging ends.
        // Unfix the subject position now that it’s no longer being dragged.
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => simulation.stop();

    }, [favourites, genres]);

    return <svg ref={svgRef} width={width} height={height}></svg>
}

export default ForceGraph;
