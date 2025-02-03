import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8787/api/courses")
            .then(response => setCourses(response.data))
            .catch(error => console.error("API error:", error));
    }, []);

    return (
        <div>
            <h1>Course List</h1>
            <ul>
                <a>{courses}</a>
            </ul>
        </div>
    );
}

export default App;
