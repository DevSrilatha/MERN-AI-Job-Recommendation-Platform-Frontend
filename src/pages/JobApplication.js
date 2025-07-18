import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const JobApplication = () => {
  const { jobId } = useParams();
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/application/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/applications/${jobId}/apply`,
        { resume, coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      fetchApplications(); // Refresh application list after applying
    } catch (error) {
      setMessage(error.response?.data?.message || "Error applying for job");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Apply for Job</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleApply}>
        <div className="mb-3">
          <label className="form-label">Resume (URL)</label>
          <input
            type="text"
            className="form-control"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cover Letter</label>
          <textarea
            className="form-control"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Apply</button>
      </form>

      <h3 className="mt-4">Applications for this Job</h3>
      <ul className="list-group">
        {applications.map((app) => (
          <li key={app._id} className="list-group-item">
            <strong>{app.applicant.name}</strong> ({app.applicant.email}) - {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobApplication;
