import { useNavigate } from "react-router-dom";
import "./Home.css"; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">
          Welcome to <span className="highlight">EZPass</span>
        </h1>
        <p className="home-subtitle">Secure Student Gate Pass Management System</p>
        <div className="home-buttons">
          <button onClick={() => navigate("/signup")} className="btn primary-btn">
            Sign Up
          </button>
          <button onClick={() => navigate("/login")} className="btn secondary-btn">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
