import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/api/job/recommendations`;

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(res.data.recommendations);
      } catch (err) {
        console.error("Error fetching recommended jobs:", err);
      }
    };

    fetchRecommendedJobs();
  }, [token]);

  return (
    <Container className="mt-4">
      <h2>AI Recommended Jobs</h2>
      <Row>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Col key={job._id} md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>
                    <strong>Company:</strong> {job.company} <br />
                    <strong>Location:</strong> {job.location} <br />
                    <strong>Skills:</strong>{" "}
                    {job.skills ? job.skills.join(", ") : "Not specified"}
                  </Card.Text>
                  <Link to={`/job/${job._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </Row>
    </Container>
  );
};

export default JobRecommendations;
