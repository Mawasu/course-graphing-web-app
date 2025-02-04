from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
import requests
import re

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

@app.route('/api/courses/', methods=['GET'])
def get_course_count():
    courses = []
    edges = []
    courseIterator = courses_collection.find({})
    for entry in courseIterator:
        courses.append({"id": entry['id'], "label": entry['name']})
        
        postreqCursor = courses_collection.find({"postrequisites": {"$in": [entry['id']]}})
        for postreq in postreqCursor:
            edges.append({"from": postreq['id'], "to": entry['id']})
        

    return jsonify({"nodes": courses, "edges": edges})

# Get a specific course by ID
@app.route('/api/courses/<string:course_id>', methods=['GET'])
def get_course(course_id):
    courses = []
    edges = []
    course_id = re.sub(r'(\d)', r' \1', course_id, 1)
    courseIterator = courses_collection.find({'id': course_id})
    for entry in courseIterator: 
        courses.append({"id": entry['id'], "label": entry['name']})
        
        postreqCursor = courses_collection.find({"postrequisites": {"$in": [entry['id']]}})
        for prereq in entry['postrequisites']:
            prereq_course = courses_collection.find_one({'id': prereq})
            if(prereq_course == None):
                courses.append({"id": prereq, "label": prereq})
                edges.append({"from": entry['id'], "to": prereq})
            else:
                print(prereq_course)
                courses.append({"id": prereq_course['id'], "label": prereq_course['name']})
                edges.append({"from": entry['id'], "to": prereq_course['id']})
        for postreq in postreqCursor:
            courses.append({"id": postreq['id'], "label": postreq['name']})
            edges.append({"from": postreq['id'], "to": entry['id']})
        

    return jsonify({"nodes": courses, "edges": edges})

@app.route('/send-to-express', methods=['POST'])
def send_to_express():
    express_url = "http://localhost:8787/api/receive-data"
    data = {"number": "two"}
    response = requests.post(express_url, json=data)
    print(response)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use Gunicorn for production (later)
