import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import axios from "axios";

const Graph = ({ course_id }) => {
    const containerRef = useRef(null);
    const [graphData, setGraphData] = useState({ nodes:[], edges:[] });
    const [baseGraphData, setBaseGraphData] = useState({ nodes:[], edges:[] });
    const [baseGraphCached, setBaseGraphCache] = useState(0);

    useEffect(() => {
        let cache = baseGraphCached;
        if(!cache) {
            axios.get("http://course-graphing-web-app.pages.dev/api/courses")
            .then((response) => response.data)
            .then((data) => setBaseGraphData(data))
            .then(console.log("base graph data secured"))
            .catch((error) => console.error("Error getting data:", error));
            setBaseGraphCache(1);
        }
    }, [baseGraphCached])

    useEffect(() => {
        if(course_id) {
            axios.get(`http://course-graphing-web-app.pages.dev/api/courses/${course_id}`)
            .then((response) => response.data)
            .then((data) => setGraphData(data))
            .catch((error) => console.error("Error getting data:", error));
        } else {
            setGraphData(baseGraphData);
        }
    }, [course_id, baseGraphData]);

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
