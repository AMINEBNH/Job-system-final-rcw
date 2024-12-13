from pymongo import MongoClient
from config import Config

# Connexion à MongoDB
client = MongoClient(Config.MONGO_URI)
db = client.get_database("joblite")

# Collections
users = db.users
recruiters = db.recruiters
jobs = db.jobs
applications = db.applications