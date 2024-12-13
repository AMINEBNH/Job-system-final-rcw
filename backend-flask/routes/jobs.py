from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client["joblite"]
jobs = Blueprint("jobs", __name__)

# Route pour récupérer les offres d'emploi avec des filtres
@jobs.route("/", methods=["GET"])
def get_jobs():
    try:
        filters = request.args
        query = {}

        # Ajout de filtres dynamiques
        if "keyword" in filters and filters["keyword"]:
            query["title"] = {"$regex": filters["keyword"], "$options": "i"}
        if "location" in filters and filters["location"]:
            query["location"] = {"$regex": filters["location"], "$options": "i"}
        if "company" in filters and filters["company"]:
            query["company"] = {"$regex": filters["company"], "$options": "i"}
        if "type" in filters and filters["type"]:
            query["type"] = filters["type"]
        if "level" in filters and filters["level"]:
            query["level"] = filters["level"]

        jobs_list = list(db.jobs.find(query))
        for job in jobs_list:
            job["_id"] = str(job["_id"])
            if "recruiter_id" in job:
                job["recruiter_id"] = str(job["recruiter_id"])

        return jsonify(jobs_list), 200
    except Exception as e:
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500



# Route pour postuler à un emploi
@jobs.route("/apply", methods=["POST"])
def apply_to_job():
    try:
        data = request.json
        job_id = data.get("job_id")
        applicant_name = data.get("applicant_name")
        motivation_letter = data.get("motivation_letter")

        if not all([job_id, applicant_name, motivation_letter]):
            return jsonify({"error": "Tous les champs sont requis"}), 400

        application = {
            "job_id": ObjectId(job_id),
            "applicant_name": applicant_name,
            "motivation_letter": motivation_letter,
        }
        db.applications.insert_one(application)
        return jsonify({"message": "Candidature envoyée avec succès"}), 200
    except Exception as e:
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500

# Route pour récupérer les candidatures pour un recruteur spécifique
jobs.route("/applications/<recruiter_id>", methods=["GET"])
def get_applications(recruiter_id):
    try:
        print(f"Recherche des applications pour le recruteur : {recruiter_id}")
        
        # Récupérer les jobs du recruteur
        recruiter_jobs = list(db.jobs.find({"userName": recruiter_id}))
        
        print(f"Jobs trouvés : {len(recruiter_jobs)}")
        
        recruiter_job_ids = [job['_id'] for job in recruiter_jobs]

        # Filtrer les applications par les IDs des jobs du recruteur
        applications = list(db.applications.find({"job_id": {"$in": recruiter_job_ids}}))

        print(f"Applications trouvées : {len(applications)}")

        for application in applications:
            application["_id"] = str(application["_id"])
            application["job_id"] = str(application["job_id"])

        return jsonify(applications), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des applications : {str(e)}")
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500