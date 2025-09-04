import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // update auth context

  let [formdata, setformdata] = useState({
    email: "",
    username: "",
    password: "",
  });
  let [error, setError] = useState(""); // track errors

  let handlechange = (e) => {
    setformdata((currdata) => {
      return { ...currdata, [e.target.name]: e.target.value };
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset before new request

    try {
      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // show backend error if available
        throw new Error(data.message || "Signup failed");
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setformdata({ email: "", username: "", password: "" });
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
      setError(error.message); // show in UI
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Sign Up
        </h2>

        {/* Show error if exists */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            id="email"
            onChange={handlechange}
            value={formdata.email}
            className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
            onChange={handlechange}
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
            onChange={handlechange}
            value={formdata.password}
            className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Signup;
