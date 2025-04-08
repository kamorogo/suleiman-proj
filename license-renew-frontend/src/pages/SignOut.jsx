import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      await fetch("http://localhost:8000/api/sign_out/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/sign_in");
  };

  return (
    <button onClick={handleLogout}>Sign Out</button>
  );
};

export default SignOut;
