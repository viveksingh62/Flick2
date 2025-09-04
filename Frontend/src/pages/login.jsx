import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // flash error message

  const handleChange = (e) => {
    setFormdata((currdata) => ({
      ...currdata,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear old error
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        // ✅ immediately update context so no refresh needed
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(from, { replace: true }); // go back to original path
      } else {
        alert("Login failed");
      }
      if (!res.ok || !data.success) {
        // backend should send { success: false, message: "Invalid credentials" }
        setError(data.message || "Invalid username or password");
        return;
      }

      // success
      setFormdata({ username: "", password: "" });

      console.log("Login success:", data);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            name="username"
            id="username"
            onChange={handleChange}
            value={formdata.username}
            className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formdata.password}
            className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
