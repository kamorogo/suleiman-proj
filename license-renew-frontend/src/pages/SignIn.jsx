import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible]= useState(false);
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
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(formData.username)) {
     
    } else {
      
    }
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
    <div className="login-page">
      <section className="login-section">
        <div className="login-container">
          <div className="login-image">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="Login visual"
            />
          </div>

          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Sign In</h2>
              </div>

              {error && <p className="error-text">{error}</p>}

              <div className="mb-6">
                <input
                  onChange={handleChange}
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Email or Username"
                  value={formData.username}
                  required
                />
              </div>


              <div className="mb-6">
                <input
                  onChange={handleChange}
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  required
                />
                  <div className="show-hide-icon" onClick={togglePasswordVisibility}>
                    <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                  </div>
              </div>

              <div className="form-options mb-6">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" />
                  Remember me
                </label>
                <Link to="/forgot_password" className="link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="btn-submit">
                Login
              </button>

              <p className="register-text">
                Don't have an account?{" "}
                <Link to="/sign_up" className="register-link">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      <style>
        {`
.login-section {
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #FFF;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
}

.login-image {
  flex: 2;
  text-align: center;
}

.login-image img {
  width: 100%;
  max-width: 700px;
  height: auto;
}

.login-form {
  flex: 1;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;

}

@media (max-width: 768px) {
  .login-image,
  .login-form {
    flex: 1 1 100%;
    max-width: 100%;
    margin-bottom: 1.5rem;
  }
}
.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-6 {
  position: relative;
}

.show-hide-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.show-hide-icon i {
  font-size: 18px;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  color: #333;
}

.form-control:focus {
  border-color: #2563eb;
  outline: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-check-input {
  margin-right: 0.5rem;
}

.link {
  font-size: 0.875rem;
  color: #2563eb;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}


.btn-submit {
  width: auto;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
   margin-right: auto;
}

.btn-submit:hover {
  background-color: #1e40af;
}

.error-text {
  color: #dc2626;
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}


.register-text {
  text-align: left;
  font-size: 0.875rem;
  margin-top: 1.5rem;
}

.register-link {
  color: #dc2626;
  text-decoration: none;
}

.register-link:hover {
  color: #b91c1c;
  text-decoration: underline;
}
`}
      </style>
    </div>
  );
};

export default Login;
