import React, { useState } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const Mpage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <div className="auth-container">
      {isSignUp ? <SignUp /> : <SignIn />}
      <button onClick={toggleForm} className="toggle-btn">
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>

      <style jsx>
        {`
          .auth-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          .toggle-btn {
            margin-top: 10px;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }

          .toggle-btn:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </div>
  );
};

export default Mpage;
