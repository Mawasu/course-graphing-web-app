import './App.css';
import Graph from "./components/Graph"
import React, { useState } from "react";



function App() {
    const [courseId, setCourseId] = useState(''); 

    const handleInputChange = (event) => {
        setCourseId(event.target.value);
    };

    return (
        <div>
            <h1>Course List</h1>
            <Graph course_id={courseId} />
            <h2>
                <input
                    type="text"
                    value={courseId}
                    onChange={handleInputChange} // Update state on text change
                    placeholder="Enter Course Name"
                />
            </h2>
        </div>
    );
}

export default App;
