import React, { useState } from "react";

const UploadLogo = () => {
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_name", companyName);
    formData.append("recruiter_name", recruiterName);

    try {
      const response = await fetch("http://localhost:5000/api/recruiter/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Logo uploadé avec succès : ${data.logo_url}`);
      } else {
        setMessage(data.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion au serveur");
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="text"
        placeholder="Nom du recruteur"
        value={recruiterName}
        onChange={(e) => setRecruiterName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nom de la compagnie"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Uploader le logo</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UploadLogo;
