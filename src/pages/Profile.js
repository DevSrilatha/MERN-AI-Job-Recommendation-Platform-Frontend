import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    skills: "",
    jobPreferences: "",
    resume: null,
    resumeURL: "",
    userId: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { _id, name, skills, preferences, resume } = res.data;

        setProfile({
          name: name || "",
          skills: skills?.join(", ") || "",
          jobPreferences: preferences || "",
          resumeURL: resume ? `${BASE_URL}${resume}` : "",
          resume: null,
          userId: _id,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch Resume URL by userId
  useEffect(() => {
    if (profile.userId) {
      const fetchResume = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const res = await axios.get(`${BASE_URL}/api/user/resume/${profile.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setProfile((prev) => ({ ...prev, resumeURL: res.data.resume }));
        } catch (err) {
          console.error("Error fetching resume:", err);
        }
      };

      fetchResume();
    }
  }, [profile.userId]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Resume file change
  const handleResumeChange = (e) => {
    setProfile({ ...profile, resume: e.target.files[0] });
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const updatedProfile = {
        name: profile.name,
        skills: profile.skills.split(",").map((skill) => skill.trim()),
        preferences: profile.jobPreferences,
      };

      await axios.put(`${BASE_URL}/api/user/profile`, updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  // Upload resume
  const handleResumeUpload = async () => {
    if (!profile.resume) {
      alert("Please select a resume file!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", profile.resume);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.post(`${BASE_URL}/api/user/upload-resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((prev) => ({
        ...prev,
        resumeURL: `${BASE_URL}${res.data.resume}`,
        resume: null,
      }));

      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert("Failed to upload resume.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>User Profile</h2>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Job Preferences</Form.Label>
              <Form.Control
                type="text"
                name="jobPreferences"
                value={profile.jobPreferences}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer, Remote Jobs"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Update Profile
            </Button>
          </Form>

          <hr />

          <h3>Resume Upload</h3>
          <Form.Group>
            <Form.Control type="file" onChange={handleResumeChange} />
            <Button variant="success" className="mt-2" onClick={handleResumeUpload}>
              Upload Resume
            </Button>
          </Form.Group>

          {profile.resumeURL && (
            <p className="mt-3">
              <a href={profile.resumeURL} target="_blank" rel="noopener noreferrer">
                View Uploaded Resume
              </a>
            </p>
          )}
        </>
      )}
    </Container>
  );
};

export default Profile;
