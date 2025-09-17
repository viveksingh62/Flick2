import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormdata((currdata) => ({
      ...currdata,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const API_URL = import.meta.env.VITE_BACKEND_URL; 
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
      credentials: "include", 
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(from, { replace: true });
    } else {
      setError(data.message || "Invalid username or password");
      return;
    }

    setFormdata({ username: "", password: "" });
  } catch (err) {
    console.error("Error:", err);
    setError("Something went wrong. Please try again later.");
  }
};


  return (
    <div className=" bg-[#1a1a2e] flex flex-col">
      <Navbar />

      <div className="flex flex-1 h-15px justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-[#16213e] rounded-2xl shadow-lg space-y-5"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-white">
            Login
          </h2>

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formdata.username}
              onChange={handleChange}
              className="bg-[#0f3460] text-white placeholder-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formdata.password}
              onChange={handleChange}
              className="bg-[#0f3460] text-white placeholder-gray-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition cursor-pointer"
          >
            Login
          </Button>
          <Link
                to="/signup"
                className="px-4 py-1 text-white  font-medium rounded-lg hover:bg-white/10 transition "
              >
               New user?
              </Link>
        </form>
    
      </div>

    </div>
  );
}

export default Login;
