from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from pymongo import MongoClient
from bson.errors import InvalidId
import fitz  # PyMuPDF pour lire les PDF
import subprocess

client = MongoClient("mongodb://localhost:27017/")
db = client["joblite"]
users = db.users

profile = Blueprint("profile", __name__)

@profile.route("/extract-skills", methods=["POST"])
def extract_skills():
    try:
        cv_file = request.files.get("cv")
        if not cv_file:
            return jsonify({"error": "CV manquant"}), 400

        # Lecture du PDF
        doc = fitz.open(stream=cv_file.read(), filetype="pdf")
        text = "".join(
            page.get_text().encode("utf-8", errors="ignore").decode("utf-8")
            for page in doc
        )

        # Interaction avec Ollama
        ollama_command = ["ollama", "run", "llama3.2"]
        process = subprocess.Popen(
            ollama_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        prompt = f"Extrais uniquement les compétences professionnelles utiles de ce texte sans sections ni catégories :\n{text}"
        stdout, stderr = process.communicate(input=prompt)

        if process.returncode != 0:
            return jsonify({"error": f"Ollama error: {stderr.strip()}"}), 500

        # Parsing de la réponse
        skills = [skill.strip() for skill in stdout.split("\n") if skill.strip() and not skill.startswith("*")]
        return jsonify({"message": "Compétences extraites avec succès", "skills": skills}), 200
    except Exception as e:
        print(f"Erreur interne dans extract-skills : {str(e)}")
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500

@profile.route("/generate-letter", methods=["POST"])
def generate_letter():
    try:
        data = request.json
        name = data.get("name")
        skills = data.get("skills", [])
        letter_type = data.get("type")  # "short" ou "long"

        if not name or not letter_type or not skills:
            return jsonify({"error": "Nom, compétences et type de lettre requis"}), 400

        skills_text = ", ".join(skills)
        prompt = (
            f"Tu es un expert en rédaction de lettres de motivation. Rédige une lettre adaptée à un poste "
            f"en utilisant ces compétences : {skills_text}. Fais une version {letter_type}.\n"
            f"Nom du candidat : {name}"
        )

        # Interaction avec Ollama
        ollama_command = ["ollama", "run", "llama3.2"]
        process = subprocess.Popen(
            ollama_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        stdout, stderr = process.communicate(input=prompt)

        if process.returncode != 0:
            return jsonify({"error": f"Ollama error: {stderr.strip()}"}), 500

        return jsonify({"letter": stdout.strip()}), 200
    except Exception as e:
        print(f"Erreur interne dans generate-letter : {str(e)}")
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500

@profile.route("/save", methods=["POST"])
def save_profile():
    try:
        data = request.json
        name = data.get("name")
        cv = data.get("cv")
        skills = data.get("skills", [])
        motivation_letter = data.get("motivationLetter", "")

        if not name:
            return jsonify({"error": "Le nom est requis"}), 400

        # Mise à jour ou création de l'utilisateur
        users.update_one(
            {"name": name},
            {"$set": {"cv": cv, "skills": skills, "motivationLetter": motivation_letter}},
            upsert=True,
        )

        return jsonify({"message": "Profil enregistré avec succès"}), 200
    except Exception as e:
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500
