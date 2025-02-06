import './App.css';
import Graph from "./components/Graph"
import React, { useDeferredValue, useState } from "react";



function App() {
    const [tempCourseId, setTempCourseId] = useState('');
    const [courseId, setCourseId] = useState('');
    const deferredId = useDeferredValue(courseId);

    const handleInputChange = (event) => {
        setTempCourseId(event.target.value);
    };

    return (
        <div>
            <h1>Course List
            <Graph course_id={deferredId} />
            </h1>
            <h2>
            <input 
                    value={tempCourseId}
                    onChange={handleInputChange}
                />
                <button type="button" onClick={() => setCourseId(tempCourseId)}>
                    Submit
                </button>
                <button type="button" onClick={() => setCourseId('')}>
                    Reset
                </button>
            </h2>
            
        </div>
    );
}

export default App;
