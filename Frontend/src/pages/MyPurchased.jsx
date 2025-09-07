import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function MyPurchases() {
    const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => { 
    const fetchPurchases = async () => {
      try {
        const res = await fetch("http://localhost:8080/my-purchases", {
          credentials: "include",
        });
        if (!res.ok) {
           navigate("/login"); // or "/"
  return; 
        }
        const data = await res.json();
        setPurchases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1 className="text-red-500">{error}</h1>;

  return (
    <div className="p-4">
        <Navbar/>
    <div className="max-w-3xl mx-auto p-6">
       
      <h2 className="text-2xl font-bold mb-6">My Purchased Prompts</h2>
      {purchases.length === 0 ? (
        <p>You haven’t bought any prompts yet.</p>
      ) : (
        <div className="grid gap-6">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold">
                {purchase.promptId?.platform}
              </h3>
              <p>{purchase.promptId?.description}</p>
              <p className="text-gray-500">
                Bought on: {new Date(purchase.boughtAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
     </div>
  )
 
}

export default MyPurchases;
