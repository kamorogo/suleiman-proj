import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/reset_password/${uidb64}/${token}/`,
        { password: newPassword }
      );
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", paddingTop: "50px" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Reset Password
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
