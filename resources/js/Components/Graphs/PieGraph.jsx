import * as d3 from 'd3'
import {useState, useContext, useEffect, useRef} from "react";
import UserContext from "@/context/UserContext.jsx";

const PieGraph = () => {
    const {
        genres,
        favourites,
    } = useContext(UserContext)

    const svgRef = useRef();
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const { width, height } = svgRef.current.getBoundingClientRect();
                setSvgSize({ width, height });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!genres || genres.length === 0 || svgSize.width === 0) return;

        const { width, height } = svgSize;
        const margin = 20;
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select(svgRef.current)
            .html('') // Clear old chart
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.9);

        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        const arcs = g.selectAll(".arc")
            .data(pie(genres))
            .enter()
            .append("g")
            .attr("class", "arc");

        // Draw the arcs (slices)
        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.label))
            .transition()
            .duration(1000)
            .attrTween("d", d => {
                const i = d3.interpolate(d.endAngle, d.startAngle);
                return t => {
                    d.endAngle = i(t);
                    return arc(d);
                };
            });

        // Add labels
        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .text(d => d.name)
            .style("fill", "#fff")
            .style("font-size", "14px");

    }, [genres, svgSize]);

    // Mock data for demonstration
    const mockData = [
        { label: "Action", value: 45 },
        { label: "Comedy", value: 30 },
        { label: "Drama", value: 25 },
        { label: "Sci-Fi", value: 15 },
        { label: "Horror", value: 5 }
    ];

    return (
        <svg ref={svgRef} className="w-full h-full"></svg>
    );
}

export default PieGraph;
