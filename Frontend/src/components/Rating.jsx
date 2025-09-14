import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useParams } from "react-router-dom";
export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || rating === 0) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/prompt/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: rating, comment: comment }),
        credentials: "include",
      });
      const data = await res.json();
      console.log("Review submitted:", data);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col gap-4"
    >
      <h2 className="text-white text-xl font-semibold">Leave a Review</h2>

      <div className="flex items-center gap-2">
        <span className="text-white font-medium">Rating:</span>
        <Rating
          name="user-rating"
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          sx={{
            color: "#fff", // color of filled stars
            "& .MuiRating-iconEmpty": {
              color: "transparent", // makes empty fill transparent
              WebkitTextStroke: "1px white", // white border
            },
          }}
        />
      </div>

      <textarea
        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        rows={5}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-emerald-500 hover:bg-emerald-600 transition text-white font-medium py-2 rounded-lg flex justify-center items-center gap-2 ${
          loading ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : null}
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
