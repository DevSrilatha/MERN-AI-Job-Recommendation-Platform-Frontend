import React, { useState, useEffect } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  // Function to handle file selection
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  // Function to upload resume
  const handleUpload = async () => {
    if (!resume) {
      alert("Please select a resume to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/user/upload-resume", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully!");
      fetchResume(); // Refresh resume URL
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch uploaded resume
  const fetchResume = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/get-resume", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setResumeUrl(response.data.resumeUrl);
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Upload Your Resume</h2>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading} className="btn btn-primary mt-2">
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
      
      {resumeUrl && (
        <div className="mt-3">
          <h4>Your Uploaded Resume:</h4>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success">
            View Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
