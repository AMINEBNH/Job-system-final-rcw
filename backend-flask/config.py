from dotenv import load_dotenv
import os

# Charger explicitement le fichier .env
env_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path=env_path)

class Config:
    SECRET_KEY = os.getenv("JWT_SECRET", "defaultsecretkey")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/joblite")
