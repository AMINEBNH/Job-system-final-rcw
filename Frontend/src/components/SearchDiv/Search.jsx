import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { getJobsWithFilters } from "../Job_api"; // API pour récupérer les jobs

const Search = ({ setJobs }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const filteredJobs = await getJobsWithFilters(filters);
      setJobs(filteredJobs);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error.message);
    }
  };

  return (
    <div className="search-container bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Recherche par mot-clé */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
          <AiOutlineSearch className="text-2xl text-blue-500" />
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Rechercher un emploi par titre..."
            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
          {filters.keyword && (
            <AiOutlineCloseCircle
              className="text-2xl text-gray-400 cursor-pointer hover:text-red-500 transition"
              onClick={() => setFilters({ ...filters, keyword: "" })}
            />
          )}
        </div>

        {/* Recherche par localisation */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
          <CiLocationOn className="text-2xl text-blue-500" />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Rechercher par localisation..."
            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
          {filters.location && (
            <AiOutlineCloseCircle
              className="text-2xl text-gray-400 cursor-pointer hover:text-red-500 transition"
              onClick={() => setFilters({ ...filters, location: "" })}
            />
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Rechercher
          </button>
          <button
  type="button"
  className="py-2 px-4 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 hover:text-gray-800 transition shadow-sm"
  onClick={() => setFilters({ keyword: "", location: "" })}
>
  Réinitialiser les filtres
</button>
        </div>
      </form>
    </div>
  );
};

export default Search;
