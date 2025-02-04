import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import axios from "axios";

const Graph = ({ course_id }) => {
    const containerRef = useRef(null);
    const [graphData, setGraphData] = useState({ nodes:[], edges:[] });

    useEffect(() => {
        if(course_id) {
            axios.get(`https://express-worker.non300300.workers.dev/api/courses/${course_id}`)
            .then((response) => response.data)
            .then((data) => setGraphData(data))
            .catch((error) => console.error("Error getting data:", error));
        } else {
            axios.get("https://express-worker.non300300.workers.dev/api/courses")
            .then((response) => response.data)
            .then((data) => setGraphData(data))
            .catch((error) => console.error("Error getting data:", error));
        }
    }, [course_id]);

    useEffect(() => {
        if (graphData.nodes.length === 0) return;
    
        const nodes = new DataSet(graphData.nodes);
        const edges = new DataSet(graphData.edges);
    
        const data = { nodes, edges };
        const options = {
          nodes: { shape: "dot", size: 16 },
          edges: { arrows: "to" },
          physics: { enabled: true },
        }
    
        const network = new Network(containerRef.current, data, options);

        return () => network.destroy();
    }, [graphData]);

    return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
};

export default Graph;
