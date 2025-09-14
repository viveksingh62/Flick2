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
  const navigate = useNavigate();

  // Fetch prompt details + reviews
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/prompt/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch prompt details");
        const json = await res.json();
        setData(json);

        const reviewRes = await fetch(
          `http://localhost:8080/prompt/${id}/reviews`,
          { credentials: "include" },
        );
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setReviews(reviewData || []);
        }

        if (user) {
          const purchaseres = await fetch(
            "http://localhost:8080/my-purchases",
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

  const handleBuy = async () => {
    setMessage(null);
    try {
      const res = await fetch(`http://localhost:8080/buy/${data._id}`, {
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
      const res = await fetch(`http://localhost:8080/prompt/${id}/review`, {
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
        `http://localhost:8080/prompt/${data._id}/review/${reviewId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter((rev) => rev._id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h1 className="text-xl font-semibold">Loading...</h1>;
  if (error) return <h1 className="text-red-500">Error: {error}</h1>;
  if (!data) return <h1>No Data Found</h1>;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="p-4">
      <Navbar />
      <div className="max-w-2xl rounded-2xl shadow-md ">
        <img
          src={data.images}
          alt={data.platform}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{data.platform}</h2>
        <p className="text-white mb-2">Owner: {data.owner?.username}</p>
        <p className="text-white mb-4">{data.description}</p>
        <p className="text-lg font-semibold mb-6">{data.price} ₹</p>

        {user && data.owner && String(user.id) === String(data.owner._id) && (
          <button
            className="mb-4 w-full px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
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
            Delete
          </button>
        )}

        {user &&
          data.owner &&
          String(user.id) !== String(data.owner._id) &&
          (alreadyBought ? (
            <p className="w-full text-center py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg">
              Already Bought
            </p>
          ) : (
            <button
              className="w-full px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
              onClick={handleBuy}
            >
              Buy Prompt
            </button>
          ))}

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      {user && alreadyBought && (
        <form
          onSubmit={handleReviewSubmit}
          className="mt-8 max-w-2xl bg-gray-900 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-2 text-white">
            Leave a Review
          </h3>
          <div className="flex items-center gap-2">
            <Rating
              name="user-rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              icon={<StarIcon style={{ color: "#fff" }} />}
              emptyIcon={<StarBorderIcon style={{ color: "#fff" }} />}
            />
            <span className="ml-2 text-white font-medium">{rating}</span>
          </div>

          <textarea
            rows={4}
            className="w-full p-3 mt-3 border rounded-lg bg-gray-800 text-white"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="mt-8 max-w-2xl">
        <h3 className="text-xl font-bold mb-4 text-white">Reviews</h3>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Rating
              value={Number(avgRating)}
              precision={0.1}
              readOnly
              icon={<StarIcon style={{ color: "#fff" }} />}
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
            <div key={r._id} className="bg-gray-700 p-4 rounded-lg mb-3 shadow">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Rating
                    value={r.rating}
                    readOnly
                    size="small"
                    icon={<StarIcon style={{ color: "#fff" }} />}
                    emptyIcon={<StarBorderIcon style={{ color: "#fff" }} />}
                  />
                  <span className="text-gray-300 text-sm">
                    {r.author?.username || "Anonymous"} • {r.rating}/5
                  </span>
                </div>

                {user && String(user.id) === String(r.author?._id) && (
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="px-3 py-1 text-sm font-medium rounded-md text-red-400 border border-red-400 hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-200"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-white mt-2">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Pagedetails;
