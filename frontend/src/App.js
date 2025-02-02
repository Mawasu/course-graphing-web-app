import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get("http://express-worker.non300300.workers.dev/api/courses")
            .then(response => setCourses(response.data))
            .catch(error => console.error("API error:", error));
    }, []);

    return (
        <div>
            <h1>Course List</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>{course.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
