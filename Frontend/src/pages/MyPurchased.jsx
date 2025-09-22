import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "@/components/loader";
import Footer from "@/components/Footbar";

function MyPurchases() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(3);
  const [expanded, setExpanded] = useState({});

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [navigate]);

  if (loading) return <Loader />;
  if (error)
    return <h1 className="text-red-500 text-center mt-10">{error}</h1>;

  const validPurchases = purchases.filter((p) => p.promptId);

  const handleLoad = () => {
    setVisible((prev) => prev + 5);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
    <div className="min-h-screen bg-[#1a1a2e] p-4 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 text-white space-y-8">
        {/* User Profile Card */}
        {user && (
          <div className="bg-[#16213e] rounded-xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-[#0f3460] p-3 rounded-lg">
                <p className="text-gray-400 text-xs sm:text-sm">Score</p>
                <p className="font-semibold">{user.score}</p>
              </div>
              <div className="bg-[#0f3460] p-3 rounded-lg">
                <p className="text-gray-400 text-xs sm:text-sm">Money</p>
                <p className="font-semibold">₹{user.money}</p>
              </div>
              <div className="bg-[#0f3460] p-3 rounded-lg">
                <p className="text-gray-400 text-xs sm:text-sm">Spent</p>
                <p className="font-semibold">₹{user.spent}</p>
              </div>
              <div className="bg-[#0f3460] p-3 rounded-lg">
                <p className="text-gray-400 text-xs sm:text-sm">Earned</p>
                <p className="font-semibold">₹{user.earned}</p>
              </div>
            </div>
          </div>
        )}

        {/* Purchased Prompts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Purchased Prompts</h2>
          {validPurchases.length === 0 ? (
            <p className="text-gray-400">You haven’t bought any prompts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {validPurchases.map((purchase) => (
                <div
                  key={purchase._id}
                  className="p-4 border rounded-lg shadow-md bg-[#16213e] flex flex-col justify-between"
                >
                  <h3 className="text-lg font-semibold mb-1">
                    {purchase.promptId.platform}
                  </h3>
                  <p className="text-gray-300 mb-2 text-sm">
                    {purchase.promptId.description}
                  </p>
                  <button
                    className="text-[#00ffcc] font-semibold mb-2 text-sm"
                    onClick={() => toggleExpand(purchase._id)}
                  >
                    {expanded[purchase._id] ? "− Hide Prompt" : "+ Show Prompt"}
                  </button>
                  {expanded[purchase._id] && (
                    <p className="text-gray-300 mb-2 text-sm">
                      {purchase.promptId.secret}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mb-1">
                    Bought on:{" "}
                    {purchase.boughtAt
                      ? new Date(purchase.boughtAt).toLocaleDateString()
                      : "—"}
                  </p>
                  <p className="text-white font-medium">Price: ₹{purchase.promptId.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Uploaded Prompts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Uploaded Prompts</h2>
          {uploads.length === 0 ? (
            <p className="text-gray-400">You haven’t uploaded any prompts yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploads.slice(0, visible).map((prompt) => (
                  <div
                    key={prompt._id}
                    className="p-4 border rounded-lg shadow-md bg-[#16213e] flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold mb-1">{prompt.platform}</h3>
                    <p className="text-gray-300 mb-2 text-sm">{prompt.description}</p>
                    <p className="text-white font-medium">Price: ₹{prompt.price}</p>
                  </div>
                ))}
              </div>
              {visible < uploads.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoad}
                    className="px-4 py-2 bg-[#0f3460] text-white rounded-lg hover:bg-[#16213e] transition-colors duration-200"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    <Footer/></>
  );
}

export default MyPurchases;
