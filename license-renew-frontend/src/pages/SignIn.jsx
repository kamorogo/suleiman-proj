import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/user/sign_in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        setError(data?.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="signup-box">
      <div className="signup-left">
        <div>
          <h11 className="headline">Welcome Back!</h11>
          <p className="description">
            Sign In to track and manage your licenses. Stay ahead of renewals effortlessly.
          </p>
        </div>
        <div className="login-image">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="Login visual"
            />
            
          </div>
      </div>

      <div className="signup-right">
        <form onSubmit={handleSubmit} className="signup-form">
        <img src='/logoWhite.png' className="form-logo" alt='img' />
          <h2 className="form-title">Sign In</h2>

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            name="username"
            placeholder="Email or Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <div className="password-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="show-hide-icon" onClick={togglePasswordVisibility}>
              <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
            </span>
          </div>

          <div className="form-options">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" /> Remember me
            </label>
            <Link to="/forgot_password" className="signin-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="submit-btn">Login</button>

          <p className="login-link">
            Don’t have an account?{" "}
            <Link to="/sign_up" className="signin-link">Register</Link>
          </p>
        </form>
      </div>

      <style>
  {`
.signup-box {
  display: flex;
  height: 100vh;
  width: 100vw;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}

.signup-left {
  width: 70%;
  background: linear-gradient(to bottom right, #1e3a8a, #3b82f6);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
}

.headline {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
}

.description {
  font-size: 30px;
  color: #d1d5db;
}
.login-image {
  flex: 2;
  text-align: center;
}

.login-image img {
  width: 100%;
  max-width: 1000px;
  height: auto;
}

.signup-right {
  width: 30%;
  background: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.form-logo {
  width: 70%;
  height: auto;
  margin: 0 auto 0px auto;
  display: block;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-title {
  text-align: center;
  color: #1e3a8a;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.signup-form input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 100%; 
}

.password-wrapper {
  position: relative;
}

.show-hide-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px; 
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 20%; 
  margin-top: 12px;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.error {
  color: #dc2626;
  text-align: center;
  font-size: 14px;
}

.login-link {
  text-align: center;
  font-size: 14px;
  margin-top: 8px;
}

.signin-link {
  color: #2563eb;
  text-decoration: none;
}

.signin-link:hover {
  text-decoration: underline;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

/* Mobile and tablet responsiveness */
@media (max-width: 768px) {
  .signup-box {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .signup-left,
  .signup-right {
    width: 100%;
    padding: 30px;
  }

  .signup-left {
    align-items: center;
    text-align: center;
  }

  .learn-more-btn {
    margin: 20px auto 0 auto;
  }

  .form-title {
    font-size: 20px;
  }

  .signup-form input {
    font-size: 13px;
    padding: 8px 12px;
  }

  .submit-btn {
    font-size: 14px;
    padding: 8px 14px;
  }

  .login-link {
    font-size: 13px;
  }
}
  `}
</style>

    </div>
  );
};

export default Login;
