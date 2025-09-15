import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

function New() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    platform: "",
    description: "",
    price: "",
    images: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // loader state

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files[0]) {
      setformdata((curr) => ({ ...curr, images: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setformdata((curr) => ({ ...curr, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("platform", formdata.platform);
    formDataToSend.append("description", formdata.description);
    formDataToSend.append("price", formdata.price);
    if (formdata.images) formDataToSend.append("images", formdata.images);

    try {
      const res = await fetch("http://localhost:8080/prompt", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await res.json();
      console.log("server response", data);

      setformdata({ platform: "", description: "", price: "", images: null });
      setPreview(null);
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#1a1a2e] min-h-screen relative">
      <Navbar />

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="animate-spin h-12 w-12 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="text-white text-lg font-medium">Uploading...</span>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-[#16213e] rounded-2xl shadow-lg space-y-5 relative z-10"
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-white">
            Add New Prompt
          </h1>

          <div className="grid gap-2">
            <Label htmlFor="platform" className="text-white">
              Platform
            </Label>
            <Input
              type="text"
              id="platform"
              name="platform"
              placeholder="Enter the platform name"
              value={formdata.platform}
              onChange={handleChange}
              className="bg-[#0f3460] text-white placeholder-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Input
              type="text"
              id="description"
              name="description"
              placeholder="Enter the description"
              value={formdata.description}
              onChange={handleChange}
              className="bg-[#0f3460] text-white placeholder-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price" className="text-white">
              Price
            </Label>
            <Input
              type="number"
              id="price"
              name="price"
              placeholder="Enter the price"
              value={formdata.price}
              onChange={handleChange}
              className="bg-[#0f3460] text-white placeholder-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="images" className="text-white">
              Upload Image
            </Label>
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-500 p-6 rounded-lg hover:border-blue-500 transition text-gray-300"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              ) : (
                <span>Drag & drop an image or click to select</span>
              )}
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default New;
