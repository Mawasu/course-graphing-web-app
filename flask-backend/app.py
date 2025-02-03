from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()  

app = Flask(__name__)
CORS(app)  

db_username = os.getenv("MONGO_USERNAME")
db_password = os.getenv("MONGO_PASSWORD")

encoded_username = quote_plus(db_username)
encoded_password = quote_plus(db_password)

mongo_uri =f"mongodb+srv://{encoded_username}:{encoded_password}@courses.9qoap.mongodb.net/?retryWrites=true&w=majority&appName=courses"

mongo_client = pymongo.MongoClient(mongo_uri)
db = mongo_client["Catelog"]
courses_collection = db["courses"]

@app.route('/api/courses/find', methods=['GET'])
def get_courses():
    courses = list(courses_collection.find({})) 
    return jsonify(courses)

@app.route('/api/courses/', methods=['GET'])
def get_course_count():
    courses = courses_collection.count_documents({})  
    return jsonify({"number": courses}), 404

# Get a specific course by ID
@app.route('/api/courses/<string:course_id>', methods=['GET'])
def get_course(course_id):
    course = courses_collection.find_one({"id": course_id})
    if course:
        course['_id'] = str(course['_id'])
        return jsonify(course)
    return jsonify({"error": "Course not found"}), 404

# Add a new course
@app.route('/api/courses', methods=['POST'])
def add_course():
    data = request.get_json()
    courses_collection.insert_one(data)
    return jsonify({"message": "Course added successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use Gunicorn for production (later)
