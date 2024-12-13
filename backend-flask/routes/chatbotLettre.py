from flask import Blueprint, request, jsonify
from langchain.document_loaders import PyPDFLoader
from langchain.llms import OpenAI
import os

lettre = Blueprint("lettre", __name__)

@lettre.route("/generate", methods=["POST"])
def generate_letter():
    try:
        data = request.get_json()
        if not data or "description" not in data or "skills" not in data:
            return jsonify({"error": "La description et les compétences sont requises."}), 400

        description = data["description"]
        skills = data["skills"]

        # Exemple d'utilisation de LangChain pour la génération de texte
        llm = OpenAI(temperature=0.7)
        prompt = f"Génère une lettre de motivation à partir des compétences suivantes : {skills} pour le poste : {description}."
        generated_letter = llm(prompt)

        return jsonify({"letter": generated_letter}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
