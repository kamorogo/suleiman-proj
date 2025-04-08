import React, { useState } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const Mpage = () => {
  const [isSignIn, setIsSignIn] = useState(false);

  const toggleForm = () => {
    setIsSignIn((prev) => !prev);
  };

  return (
    <div className="auth-container">
      {isSignIn ? <SignIn /> : <SignUp />}
      <a href="#" onClick={toggleForm} className="toggle-btn">
        {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
      </a>
      <style jsx>
        {`
          .auth-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 20px; 
          }

          .toggle-link {
            margin-top: 20px;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }

          .toggle-link:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </div>
  );
};

export default Mpage;
