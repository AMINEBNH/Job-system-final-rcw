from flask import Blueprint, request, jsonify, make_response
import subprocess

chatbot = Blueprint("chatbot", __name__, url_prefix="/api/chat")

@chatbot.route("/", methods=["POST"])
def chat_with_ollama():
    try:
        data = request.get_json()
        prompt = data.get("prompt")

        if not prompt:
            return jsonify({"error": "Le message est requis."}), 422

        # Commande pour exécuter Ollama
        command = ["ollama", "run", "llama3.2"]
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        # Envoyer le prompt à Ollama
        stdout, stderr = process.communicate(input=prompt)

        # Vérification des erreurs et gestion des réponses vides
        if process.returncode != 0 or not stdout:
            return jsonify({"error": f"Ollama error: {stderr.strip()} or no response received"}), 500

        # Nettoyer et formater la réponse
        response_text = stdout.strip()

        # Ajouter des headers pour l'encodage UTF-8
        response = make_response(jsonify({"response": response_text}), 200)
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        return response

    except Exception as e:
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500
