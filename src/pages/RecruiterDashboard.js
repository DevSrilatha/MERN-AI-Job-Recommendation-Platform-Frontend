import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container } from "react-bootstrap";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    title: "", description: "", company: "", location: "", category: "", salary: "", jobType: "", skillsRequired: []
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/job/recruiter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/application/${jobId}/fetchapplications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data || []);
      setSelectedJob(res.data?.[0]?.job?.title || "Selected Job");
      setShowApplicationsModal(true);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (!currentJob.title || !currentJob.company) {
        alert("Title and Company are required!");
        return;
      }

      if (!editMode) {
        const isDuplicate = jobs.some(
          (job) =>
            job.title.toLowerCase() === currentJob.title.toLowerCase() &&
            job.company.toLowerCase() === currentJob.company.toLowerCase()
        );
        if (isDuplicate) {
          alert("A job with the same title and company already exists!");
          return;
        }
      }

      const payload = {
        ...currentJob,
        skillsRequired: currentJob.skillsRequired.map((s) => s.trim()),
      };

      if (editMode) {
        await axios.put(`${BASE_URL}/api/job/${currentJob._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BASE_URL}/api/job/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchJobs();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  const openModal = (job = { title: "", description: "", company: "", location: "", category: "", salary: "", jobType: "", skillsRequired: [] }) => {
    setCurrentJob(job);
    setEditMode(!!job._id);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Recruiter Dashboard</h2>
      <Button variant="primary" onClick={() => openModal()}>
        + Add Job
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => fetchApplications(job._id)}>
                  View Applications
                </Button>{" "}
                <Button variant="warning" size="sm" onClick={() => openModal(job)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(job._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Job Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Job" : "Add Job"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentJob.title}
                onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={currentJob.company}
                onChange={(e) => setCurrentJob({ ...currentJob, company: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={currentJob.location}
                onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={currentJob.category}
                onChange={(e) => setCurrentJob({ ...currentJob, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                value={currentJob.salary}
                onChange={(e) => setCurrentJob({ ...currentJob, salary: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Job Type</Form.Label>
              <Form.Control
                type="text"
                value={currentJob.jobType}
                onChange={(e) => setCurrentJob({ ...currentJob, jobType: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentJob.description}
                onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Skills Required (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={currentJob.skillsRequired.join(", ")}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, skillsRequired: e.target.value.split(",") })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>
            {editMode ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Applications Modal */}
      <Modal show={showApplicationsModal} onHide={() => setShowApplicationsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Applications for {selectedJob}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applications.length > 0 ? (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Resume</th>
                  <th>Cover Letter</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.applicant?.name}</td>
                    <td>{app.applicant?.email}</td>
                    <td>
                      <a href={app.resume} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                    </td>
                    <td>{app.coverLetter}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>⚠️ No applications yet.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RecruiterDashboard;
