from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models import users, recruiters  # Assurez-vous que cette collection est bien définie dans MongoDB
from datetime import timedelta

auth = Blueprint("auth", __name__)
bcrypt = Bcrypt()

# Route pour l'inscription utilisateur
@auth.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not (name and email and password):
        return jsonify({"error": "Tous les champs sont requis."}), 400

    if users.find_one({"email": email}):
        return jsonify({"error": "Email déjà utilisé"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    users.insert_one({"name": name, "email": email, "password": hashed_password})
    return jsonify({"message": "Utilisateur créé avec succès"}), 201

# Route pour l'inscription recruteur
@auth.route("/recruiter-signup", methods=["POST"])
def recruiter_signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    logo_url = data.get("logo_url", "")  # Chemin pour le logo

    if not (name and email and password):
        return jsonify({"error": "Tous les champs sont requis."}), 400

    if recruiters.find_one({"email": email}):
        return jsonify({"error": "Email déjà utilisé"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    recruiters.insert_one({"name": name, "email": email, "password": hashed_password, "logo_url": logo_url})
    return jsonify({"message": "Recruteur créé avec succès"}), 201

# Route pour la connexion utilisateur ou recruteur
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        is_recruiter = data.get("is_recruiter", False)

        # Rechercher l'utilisateur ou le recruteur dans MongoDB
        collection = recruiters if is_recruiter else users
        user = collection.find_one({"email": email})

        if not user or not bcrypt.check_password_hash(user["password"], password):
            return jsonify({"error": "Email ou mot de passe incorrect"}), 401

        # Génération d'un token JWT avec l'identité utilisateur
        access_token = create_access_token(identity={"id": str(user["_id"]), "name": user["name"], "is_recruiter": is_recruiter})
        return jsonify({"token": access_token, "name": user["name"], "email": email, "is_recruiter": is_recruiter}), 200
    except Exception as e:
        return jsonify({"error": "Erreur interne"}), 500
