import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/job/all`);
        
        console.log("Full API Response:", response.data);
        
        // Ensure we set the correct data structure
        const jobData = Array.isArray(response.data) ? response.data : response.data.jobs;

        if (!Array.isArray(jobData)) {
          throw new Error("Invalid jobs data format");
        }

        setJobs(jobData);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Job Listings</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="row">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="col-md-4 mb-4" key={job._id}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{job.title || "No Title"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {job.company || "Unknown Company"} - {job.location || "Unknown Location"}
                  </Card.Subtitle>
                  <Card.Text>{job.description ? job.description.substring(0, 100) : "No Description"}...</Card.Text>
                  <Link to={`/job/${job._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          !loading && !error && <p className="text-center">No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default JobList;
