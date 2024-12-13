from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config
from routes.auth import auth
from routes.profile import profile
from routes.chatbot import chatbot
from routes.jobs import jobs
import os
from routes.recruiter import recruiter
#Debeug JWT
print(f"Clé JWT utilisée dans l'application : {Config.SECRET_KEY}")




# Initialisation de l'application Flask
app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(recruiter, url_prefix="/api/recruiter")
# Configuration de CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


# Initialisation de JWT
jwt = JWTManager(app)

# Connexion à MongoDB
try:
    client = MongoClient(Config.MONGO_URI)
    db = client.get_database("joblite")
    print("✅ Connexion réussie à MongoDB")
except Exception as e:
    print(f"❌ Erreur lors de la connexion à MongoDB : {e}")
    exit(1)

# Enregistrement des routes
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(profile, url_prefix="/api/profile")
app.register_blueprint(chatbot, url_prefix="/api/chat")
app.register_blueprint(jobs, url_prefix="/api/jobs")

# Route pour servir les fichiers statiques (logos)
@app.route('/assets/logos/<path:filename>')
def serve_logos(filename):
    directory = os.path.join(os.getcwd(), 'assets/logos')
    if not os.path.exists(directory):
        return {"error": "Le répertoire des logos n'existe pas."}, 404
    return send_from_directory(directory, filename)

# Gestion des prévols pour CORS
@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = app.make_response("")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type")
        return response, 200

# Point de départ de l'application
if __name__ == "__main__":
    if not os.getenv("SECRET_KEY"):
        print("❌ La clé secrète n'est pas configurée. Veuillez définir 'SECRET_KEY' dans les variables d'environnement.")
        exit(1)
    app.run(debug=True, port=5000)
