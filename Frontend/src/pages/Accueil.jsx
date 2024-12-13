import React from "react";
import { useNavigate } from "react-router-dom";

const Accueil = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 leading-tight">
          Bienvenue sur <span className="text-blue-800">JobLite</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mt-4">
          La plateforme intelligente pour optimiser vos recrutements et
          candidatures avec l'aide de notre <span className="font-semibold text-blue-500">technologie IA</span>.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full text-center">
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Trouvez des talents
          </h3>
          <p className="text-gray-600">
            Accédez à un vaste pool de candidats qualifiés en quelques clics.
            Notre IA vous aide à identifier les meilleurs profils rapidement.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Simplifiez les candidatures
          </h3>
          <p className="text-gray-600">
            Postulez facilement avec des outils intuitifs et une expérience
            utilisateur fluide.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Analyse intelligente
          </h3>
          <p className="text-gray-600">
            Notre IA analyse les CV et génère automatiquement des lettres de
            motivation adaptées aux entreprises.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Commencez maintenant
        </button>
        <p className="mt-4 text-gray-600">
          Pas encore de compte ?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:underline"
          >
            Inscrivez-vous
          </button>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-blue-600 text-white py-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} JobLite. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default Accueil;
