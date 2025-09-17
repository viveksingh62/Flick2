import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function Pagedetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [alreadyBought, setAlreadyBought] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [relatedPrompts, setRelatedPrompts] = useState([]);

  const navigate = useNavigate();
 const API_URL = import.meta.env.VITE_BACKEND_URL;
  // Fetch prompt details + reviews
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/prompt/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch prompt details");
        const json = await res.json();
        setData(json);

        // Reviews
        const reviewRes = await fetch(
          `${API_URL}/prompt/${id}/reviews`,
          { credentials: "include" },
        );
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setReviews(reviewData || []);
        }

        // Check if user bought the prompt
        if (user) {
          const purchaseres = await fetch(
            `${API_URL}/my-purchases`,
            {
              credentials: "include",
            },
          );
          if (purchaseres.ok) {
            const data = await purchaseres.json();
            const purchasesArray = data.purchases || [];
            const hasBought = purchasesArray.some(
              (p) => String(p.promptId?._id) === String(json._id),
            );
            setAlreadyBought(hasBought);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // Fetch related prompts for ChatGPT
  useEffect(() => {
    if (data && data.platform) {
      const fetchRelated = async () => {
        try {
          const res = await fetch(
            `${API_URL}/prompts/${data.platform}`,
          );
          const json = await res.json();
          if (json.success) {
            setRelatedPrompts(json.prompts.filter((p) => p._id !== data._id));
          }
        } catch (err) {
          console.error("Failed to fetch related prompts:", err);
        }
      };
      fetchRelated();
    }
  }, [data]);

  const handleBuy = async () => {
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/buy/${data._id}`, {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(result?.message || "Failed to buy prompt");

      setMessage({ type: "success", text: result.message });
      setAlreadyBought(true);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/prompt/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment: reviewText }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to post review");

      setReviews((prev) => [result.review, ...prev]);
      setReviewText("");
      setRating(0);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(
        `${API_URL}/prompt/${data._id}/review/${reviewId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter((rev) => rev._id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <h1 className="text-xl font-semibold text-center mt-10">Loading...</h1>
    );
  if (error)
    return <h1 className="text-red-500 text-center mt-10">Error: {error}</h1>;
  if (!data) return <h1 className="text-center mt-10">No Data Found</h1>;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-4 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-6 space-y-6">
        {/* Prompt Card */}
        <div className="bg-[#16213e] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="md:w-1/2 w-full h-96 md:h-auto">
            <img
              src={data.images}
              alt={data.platform}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{data.platform}</h2>
              <p className="text-gray-300 mb-2">
                Owner: {data.owner?.username}
              </p>
              <p className="text-gray-300 mb-4">{data.description}</p>
              <p className="text-xl font-semibold mb-4 text-[#e94560]">
                {data.price} ₹
              </p>
            </div>

            {/* Owner vs Buyer Actions */}
            <div className="space-y-3">
              {user && String(user.id) === String(data.owner?._id) && (
                <button
                  className="w-full px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow hover:from-red-600 hover:to-red-700 transition"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:8080/prompt/${data._id}`,
                        { method: "DELETE", credentials: "include" },
                      );
                      if (res.ok) navigate("/");
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Delete Prompt
                </button>
              )}

              {user &&
                String(user.id) !== String(data.owner?._id) &&
                (alreadyBought ? (
                  <p className="w-full text-center py-2 bg-[#0f3460] text-gray-300 font-semibold rounded-lg">
                    Already Bought
                  </p>
                ) : (
                  <button
                    className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
                    onClick={handleBuy}
                  >
                    Buy Prompt
                  </button>
                ))}

              {message && (
                <p
                  className={`mt-2 text-center font-medium ${
                    message.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {user && alreadyBought && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-[#16213e] p-6 rounded-2xl shadow-lg space-y-4"
          >
            <h3 className="text-xl font-semibold mb-2 text-white">
              Leave a Review
            </h3>
            <div className="flex items-center gap-2">
              <Rating
                name="user-rating"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                icon={<StarIcon style={{ color: "#e94560" }} />}
                emptyIcon={<StarBorderIcon style={{ color: "#fff" }} />}
              />
              <span className="ml-2 text-white font-medium">{rating}</span>
            </div>

            <textarea
              rows={4}
              className="w-full p-3 border rounded-lg bg-[#0f3460] text-white placeholder-gray-400"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Reviews</h3>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Rating
                value={Number(avgRating)}
                precision={0.1}
                readOnly
                icon={<StarIcon style={{ color: "#e94560" }} />}
                emptyIcon={<StarBorderIcon style={{ color: "#fff" }} />}
              />
              <span className="text-white text-lg font-medium">
                {avgRating} / 5 ({reviews.length} reviews)
              </span>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                className="bg-[#0f3460] p-4 rounded-xl shadow flex flex-col space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rating
                      value={r.rating}
                      readOnly
                      size="small"
                      icon={<StarIcon style={{ color: "#e94560" }} />}
                      emptyIcon={<StarBorderIcon style={{ color: "#fff" }} />}
                    />
                    <span className="text-gray-300 text-sm">
                      {r.author?.username || "Anonymous"} • {r.rating}/5
                    </span>
                  </div>
                  {user && String(user.id) === String(r.author?._id) && (
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="px-3 py-1 text-sm font-medium rounded-md text-red-400 border border-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-white">{r.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Related Prompts */}
        {relatedPrompts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-white text-center">
              Other {data.platform} Prompts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {relatedPrompts.map((prompt) => (
                <div
                  key={prompt._id}
                  onClick={() => navigate(`/prompt/${prompt._id}`)}
                  className="cursor-pointer p-4 border rounded-lg shadow-md bg-[#1a1a2e] hover:bg-[#16213e] transition w-full max-w-sm"
                >
                  <img
                    src={prompt.images}
                    alt={prompt.platform}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {prompt.platform}
                  </h4>
                  <p className="text-gray-300">{prompt.description}</p>
                  <p className="text-green-400 font-medium mt-2">
                    ₹{prompt.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pagedetails;
