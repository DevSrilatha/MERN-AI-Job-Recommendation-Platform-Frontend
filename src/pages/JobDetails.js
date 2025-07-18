import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL; // Change this when deploying

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/job/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload a resume before applying.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      const response = await axios.post(
        `${BASE_URL}/api/application/${job._id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Application successful:", response.data);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to apply for the job.");
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{job.title}</h2>
      <p><strong>📍 Location:</strong> {job.location}</p>
      <p><strong>🏢 Company:</strong> {job.company}</p>
      <p><strong>💼 Job Type:</strong> {job.jobType}</p>
      <p><strong>💰 Salary:</strong> {job.salary}</p>
      <p><strong>📂 Category:</strong> {job.category}</p>
      <p><strong>📝 Description:</strong> {job.description}</p>

      <p><strong>🔹 Skills Required:</strong></p>
      <ul>
        {job.skillsRequired.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <p><strong>👤 Posted By:</strong> {job.postedBy.name}</p>
      <p><strong>🕒 Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

      <button className="btn btn-success" onClick={() => setApplying(true)}>Apply Now</button>

      {applying && (
        <div className="mt-4 p-3 border rounded">
          <h4>Apply for {job.title}</h4>
          <form onSubmit={handleApply}>
            <div className="mb-3">
              <label>Cover Letter</label>
              <textarea
                className="form-control"
                rows="3"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-3">
              <label>Upload Resume (PDF only)</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setResume(e.target.files[0])}
                accept=".pdf"
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit Application</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setApplying(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
