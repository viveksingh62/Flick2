import React, { useEffect, useState } from "react";
import { Await, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
function Pagedetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [alreadyBought, setAlreadyBought] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:8080/prompt/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch prompt details");
        }

        const json = await res.json();
        setData(json);

        if (user) {
          const purchaseres = await fetch(
            "http://localhost:8080/my-purchases",
            {
              credentials: "include",
              method: "GET",
            },
          );
          if (purchaseres.ok) {
            const data = await purchaseres.json();
            const purchasesArray = data.purchases || [];
            const hasBought = purchasesArray.some(
              (p) => String(p.promptId?._id) == String(json._id),
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

      if (!res.ok) {
        throw new Error(result?.message || "Failed to buy prompt");
      }

      setMessage({ type: "success", text: result.message });
      setAlreadyBought(true);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (loading) return <h1 className="text-xl font-semibold">Loading...</h1>;
  if (error) return <h1 className="text-red-500">Error: {error}</h1>;
  if (!data) return <h1>No Data Found</h1>;

  return (
    <div className="p-4">
      <Navbar />
      <div className="max-w-2xl  rounded-2xl shadow-md">
        <img
          src={data.images}
          alt={data.platform}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{data.platform}</h2>
        <p className="text-gray-600 mb-2">Owner: {data.owner?.username}</p>
        <p className="text-gray-800 mb-4">{data.description}</p>
        <p className="text-lg font-semibold mb-6">{data.price} ₹</p>

        {user && data.owner && String(user.id) === String(data.owner._id) && (
          <button
            className="mb-4 w-full px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
            onClick={async () => {
              try {
                const res = await fetch(
                  `http://localhost:8080/prompt/${data._id}`,
                  {
                    method: "DELETE",
                    credentials: "include",
                  },
                );
                if (res.ok) {
                  navigate("/");
                }
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
    </div>
  );
}

export default Pagedetails;
