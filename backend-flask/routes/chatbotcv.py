from flask import Blueprint, request, jsonify
from langchain.document_loaders import PyPDFLoader
import os

cv = Blueprint("cv", __name__)

@cv.route("/extract", methods=["POST"])
def extract_skills():
    try:
        if "cv_file" not in request.files:
            return jsonify({"error": "Aucun fichier CV reçu."}), 400

        cv_file = request.files["cv_file"]
        file_path = os.path.join("/tmp", cv_file.filename)
        cv_file.save(file_path)

        # Exemple d'extraction de texte avec LangChain
        loader = PyPDFLoader(file_path)
        document = loader.load()

        text_content = " ".join([page.page_content for page in document])
        skills = [word for word in text_content.split() if len(word) > 3]  # Simplification

        os.remove(file_path)
        return jsonify({"skills": skills}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
