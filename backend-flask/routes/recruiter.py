from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client["joblite"]
recruiter = Blueprint("recruiter", __name__)

# Récupérer les détails d'un recruteur via email
@recruiter.route("/<email>", methods=["GET"])
def get_recruiter_details(email):
    try:
        recruiter = db.recruiters.find_one({"email": email}, {"_id": 1, "name": 1, "logo_url": 1})
        if not recruiter:
            return jsonify({"error": "Recruteur non trouvé"}), 404
        recruiter["_id"] = str(recruiter["_id"])
        return jsonify(recruiter), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération des informations : {str(e)}"}), 500

# Récupérer les jobs postés par un recruteur
@recruiter.route("/jobs/<userName>", methods=["GET"])
def get_recruiter_jobs(userName):
    try:
        recruiter = db.recruiters.find_one({"name": userName}, {"_id": 1})
        if not recruiter:
            return jsonify({"error": "Recruteur non trouvé"}), 404

        recruiter_id = recruiter["_id"]
        jobs = list(
            db.jobs.find({"recruiter_id": recruiter_id}, {"_id": 1, "title": 1, "location": 1, "time": 1, "descr": 1, "skills": 1})
        )
        for job in jobs:
            job["_id"] = str(job["_id"])
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération des jobs : {str(e)}"}), 500

# Ajouter un nouveau job
@recruiter.route("/jobs", methods=["POST"])
def add_job():
    try:
        data = request.json
        user_name = data.get("userName")  # Récupérer le userName
        if not user_name:
            return jsonify({"error": "Le nom d'utilisateur est requis"}), 400

        # Trouver le recruteur par userName
        recruiter = db.recruiters.find_one({"name": user_name}, {"_id": 1})
        if not recruiter:
            return jsonify({"error": "Recruteur non trouvé"}), 404

        # Créer le job avec l'ID du recruteur
        job = {
            "title": data.get("title"),
            "location": data.get("location"),
            "time": data.get("time"),
            "descr": data.get("descr"),
            "skills": data.get("skills", []),
            "recruiter_id": recruiter["_id"],
        }
        db.jobs.insert_one(job)
        return jsonify({"message": "Job ajouté avec succès"}), 201
    except Exception as e:
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500

# Récupérer les candidatures pour les jobs d'un recruteur
@recruiter.route("/applications/<userName>", methods=["GET"])
def get_recruiter_applications(userName):
    try:
        recruiter = db.recruiters.find_one({"name": userName}, {"_id": 1})
        if not recruiter:
            return jsonify({"error": "Recruteur non trouvé"}), 404

        recruiter_id = recruiter["_id"]
        jobs = list(db.jobs.find({"recruiter_id": recruiter_id}, {"_id": 1}))
        job_ids = [job["_id"] for job in jobs]

        applications = list(db.applications.find({"job_id": {"$in": job_ids}}))
        for application in applications:
            application["_id"] = str(application["_id"])
            application["job_id"] = str(application["job_id"])

        return jsonify(applications), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération des candidatures : {str(e)}"}), 500
