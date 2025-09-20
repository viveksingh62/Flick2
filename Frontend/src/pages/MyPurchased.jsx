import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/loader.jsx";
import Footer from "@/components/Footbar";
function MyPurchases() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(3);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch user data and purchases
  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/my-purchases`, {
        credentials: "include",
      });
      if (!res.ok) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      setPurchases(data.purchases);
      setUser(data.user);

      // Fetch uploads
      const uploadRes = await fetch(`${API_URL}/my-uploads`, {
        credentials: "include",
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        setUploads(uploadData.prompts);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle “Load More” uploads
  const handleLoadMore = () => setVisible((prev) => prev + 5);

  // Handle purchase refund / update dynamically (if you add a buy button)
  const handlePurchase = async (promptId) => {
    try {
      const res = await fetch(`${API_URL}/buy/${promptId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
      } else {
        // Update user and refetch purchases
        setUser(data.user);
        fetchUserData();
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

   if (loading) return <Loader />;
  if (error)
    return (
      <h1 className="text-center mt-10 text-red-500">Error: {error}</h1>
    );

  const validPurchases = purchases.filter((p) => p.promptId);
  const progress = user ? Math.min((user.spent / user.earned) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-4 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 text-white">
        {/* User Profile Card */}
        {user && (
          <div className="bg-[#16213e] rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-gray-300">{user.email}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-[#0f3460] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Score</p>
                <p className="font-semibold">{user.score}</p>
              </div>
              <div className="bg-[#0f3460] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Money</p>
                <p className="font-semibold">₹{user.money}</p>
              </div>
              <div className="bg-[#0f3460] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Spent</p>
                <p className="font-semibold">₹{user.spent}</p>
              </div>
              <div className="bg-[#0f3460] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Earned</p>
                <p className="font-semibold">₹{user.earned}</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <p className="text-gray-400 text-sm mb-1">Spending Progress</p>
              <div className="bg-[#0f3460] rounded-full h-4">
                <div
                  className="bg-[#e94560] h-4 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                {progress.toFixed(0)}% of earned money spent
              </p>
            </div>
          </div>
        )}

        {/* Purchased Prompts */}
        <h2 className="text-2xl font-bold mb-6 text-white">
          My Purchased Prompts
        </h2>
        {validPurchases.length === 0 ? (
          <p className="text-gray-400 mb-6">
            You haven’t bought any prompts yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {validPurchases.map((purchase) => (
              <div
                key={purchase._id}
                className="p-4 border rounded-lg shadow-sm bg-[#16213e]"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Platform: {purchase.promptId.platform}
                </h3>
                <p className="text-gray-300 mb-2">
                  Description: {purchase.promptId.description}
                </p>
                <p className="text-white font-medium mt-2">
                  Prompt: {purchase.promptId.secret}
                </p>
                <p className="text-gray-400 text-sm">
                  Bought on:{" "}
                  {purchase.boughtAt
                    ? new Date(purchase.boughtAt).toLocaleDateString()
                    : "—"}
                </p>
                <p className="text-white font-medium mt-2">
                  Price: ₹{purchase.promptId.price}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Prompts */}
        <h2 className="text-2xl font-bold mb-6 text-white">
          My Uploaded Prompts
        </h2>
        {uploads.length === 0 ? (
          <p className="text-gray-400 mb-6">
            You haven’t uploaded any prompts yet.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              {uploads.slice(0, visible).map((prompt) => (
                <div
                  key={prompt._id}
                  className="p-4 border rounded-lg shadow-sm bg-[#16213e]"
                >
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {prompt.platform}
                  </h3>
                  <p className="text-gray-300 mb-2">{prompt.description}</p>
                  <p className="text-white font-medium mt-2">
                    Price: ₹{prompt.price}
                  </p>
                </div>
              ))}
            </div>

            {visible < uploads.length && (
              <div className="flex justify-center mb-8">
                <button
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#0f3460] text-white rounded-lg hover:bg-[#16213e] transition-colors duration-200"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
       <Footer />
    </div>
  );
}

export default MyPurchases;
