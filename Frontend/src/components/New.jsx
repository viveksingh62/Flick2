import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import Loader from "./loader";
function New() {
  const navigate = useNavigate();
 const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [formdata, setFormdata] = useState({
    platform: "",
    description: "",
    price: "",
    secret: "",
    images: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files[0]) {
      setFormdata((curr) => ({ ...curr, images: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormdata((curr) => ({ ...curr, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: ensure no field is empty
    if (
      !formdata.platform.trim() ||
      !formdata.description.trim() ||
      !formdata.price ||
      !formdata.secret.trim() ||
      !formdata.images
    ) {
      alert("All fields including image are required!");
      return; // Stop submission
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("platform", formdata.platform);
    formDataToSend.append("description", formdata.description);
    formDataToSend.append("price", formdata.price);
    formDataToSend.append("secret", formdata.secret);
    formDataToSend.append("images", formdata.images);

    try {
      const res = await fetch(`${API_URL}/prompt`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await res.json();
      console.log("server response", data);

      // Reset form
      setFormdata({ platform: "", description: "", price: "", secret: "", images: null });
      setPreview(null);

      navigate("/");
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong while submitting!");
    } finally {
      setLoading(false);
    }
  };

  // Form validation for disabling submit button
  const isFormValid =
    formdata.platform.trim() &&
    formdata.description.trim() &&
    formdata.price &&
    formdata.secret.trim() &&
    formdata.images;

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

          {/* Platform */}
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

          {/* Description */}
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

          {/* Prompt */}
          <div className="grid gap-2">
            <Label htmlFor="secret" className="text-white">
              Prompt
            </Label>
            <Input
              type="text"
              id="secret"
              name="secret"
              placeholder="Enter the Prompt"
              value={formdata.secret}
              onChange={handleChange}
              className="bg-[#0f3460] text-white placeholder-gray-400"
            />
          </div>

          {/* Price */}
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

          {/* Image Upload */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!isFormValid || loading}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default New;
