import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";





const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, { name, email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/Home");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input className="form-control mb-2" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="form-control mb-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button className="btn btn-primary">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
