import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 fw-bold">Welcome to the AI-Powered Job Recommendation Platform</h1>
      <p className="lead">Find the best job recommendations powered by AI</p>
      <Link to="/joblist" className="btn btn-primary btn-lg mt-3">
        View Jobs
      </Link>
    </div>
  );
};

export default Home;

