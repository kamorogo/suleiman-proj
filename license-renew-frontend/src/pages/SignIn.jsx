import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log(formData); 

    try {
      const response = await fetch("http://127.0.0.1:8000/user/sign_in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Login response:", data); 

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Token Stored:", localStorage.getItem("token"));

        navigate("/home");
      } else {
        setError(data?.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };


  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
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
        <button type="submit">Sign In</button>
      </form>
      <style jsx>
        {`
          .signin-container {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          h2 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
          }

          form {
            display: flex;
            flex-direction: column;
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
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          button:hover {
            background-color: #0056b3;
          }

          .error-message {
            color: red;
            text-align: center;
            margin-bottom: 15px;
            font-size: 14px;
          }
        `}
      </style>
    </div>
  );
};

export default SignIn;
