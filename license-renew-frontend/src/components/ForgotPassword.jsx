import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/forgot_password/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send Reset Link</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "40px 20px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    marginTop: "80px"
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer"
  },
  message: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#333"
  }
};

export default ForgotPassword;
