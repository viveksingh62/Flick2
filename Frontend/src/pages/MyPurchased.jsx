import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Loader from "../components/loader.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "@/components/Footbar";

function Pagedetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [alreadyBought, setAlreadyBought] = useState(false);
  const [buying, setBuying] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [relatedPrompts, setRelatedPrompts] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/prompt/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch prompt details");
        const json = await res.json();
        setData(json);

        const reviewRes = await fetch(`${API_URL}/prompt/${id}/reviews`, { credentials: "include" });
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setReviews(reviewData || []);
        }

        if (user) {
          const purchaseres = await fetch(`${API_URL}/my-purchases`, { credentials: "include" });
          if (purchaseres.ok) {
            const data = await purchaseres.json();
            const purchasesArray = data.purchases || [];
            const hasBought = purchasesArray.some(
              (p) => String(p.promptId?._id) === String(json._id)
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

  useEffect(() => {
    if (data && data.platform) {
      const fetchRelated = async () => {
        try {
          const res = await fetch(`${API_URL}/prompts/${data.platform}`);
          const json = await res.json();
          if (json.success) setRelatedPrompts(json.prompts.filter((p) => p._id !== data._id));
        } catch (err) {
          console.error("Failed to fetch related prompts:", err);
        }
      };
      fetchRelated();
    }
  }, [data]);

  const handleBuy = async () => {
    setBuying(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/buy/${data._id}`, { method: "POST", credentials: "include" });
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(result?.message || "Failed to buy prompt");
      setMessage({ type: "success", text: result.message });
      setAlreadyBought(true);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBuying(false);
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
      const res = await fetch(`${API_URL}/prompt/${data._id}/review/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((rev) => rev._id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;
  if (error) return <h1 className="text-red-500 text-center mt-10">Error: {error}</h1>;
  if (!data) return <h1 className="text-center mt-10">No Data Found</h1>;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-4 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-6 space-y-6">
        {/* Prompt Card */}
        <div className="bg-[#16213e] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 w-full h-96 md:h-auto">
            <img src={data.images} alt={data.platform} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{data.platform}</h2>
              <p className="text-gray-300 mb-2">Owner: {data.owner?.username}</p>
              <p className="text-gray-300 mb-4">{data.description}</p>
              <p className="text-xl font-semibold mb-4 text-[#e94560]">{data.price} ₹</p>
            </div>

            <div className="space-y-3">
              {!user ? (
                <p className="w-full text-center py-2 bg-[#0f3460] text-gray-300 font-semibold rounded-lg">
                  Login to buy the prompt
                </p>
              ) : String(user.id) !== String(data.owner?._id) ? (
                <button
                  className={`w-full px-6 py-2 font-semibold rounded-lg shadow text-white transition 
                    ${
                      alreadyBought
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 cursor-pointer"
                    }`}
                  onClick={handleBuy}
                  disabled={alreadyBought || buying}
                >
                  {buying ? (
                    <div className="flex items-center justify-center gap-2">
                      <CircularProgress size={20} style={{ color: "#fff" }} />
                      Processing...
                    </div>
                  ) : alreadyBought ? (
                    "Already Bought"
                  ) : (
                    "Buy Prompt"
                  )}
                </button>
              ) : null}

              {message && (
                <p
                  className={`mt-2 text-center font-medium ${
                    message.type === "success" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews & Related Prompts Sections remain the same as your previous code */}
      </div>
      <Footer />
    </div>
  );
}

export default Pagedetails;
