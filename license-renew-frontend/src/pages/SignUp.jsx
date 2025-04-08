import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log(formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/user/sign_up/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("User registered successfully!");
        setTimeout(() => {
          navigate("/sign_in");
        }, 2000);
      } else {
        setError(data?.message || "Failed to register");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>

        <p className="signup-link">
          Already have an account? <Link to="/sign_in">Sign In</Link>
        </p>
        
      </form>

      <style jsx>
        {`
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .signup-container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            min-height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          h2 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
          }

          p {
            font-size: 14px;
            text-align: center;
          }

          p.error {
            color: red;
          }

          p.success {
            color: green;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          input {
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }

          input:focus {
            outline: none;
            border-color: #007bff;
          }

          button {
            padding: 12px;
            background-color: #007bff;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          button:hover {
            background-color: #0056b3;
          }

          button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
            
          .signup-link {
            text-align: center;
            margin-top: 15px;
          }

          .signup-link a {
            color: #007bff;
            text-decoration: none;
          }

          .signup-link a:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
};

export default SignUp;
