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

mongo_client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["university"]
courses_collection = db["courses"]

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = list(courses_collection.find({}, {"_id": 0}))  # Exclude _id field
    return jsonify(courses)

# Get a specific course by ID
@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = courses_collection.find_one({"id": course_id}, {"_id": 0})
    if course:
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
