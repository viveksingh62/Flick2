import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function Pagedetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  let [data, setdata] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/prompt/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setdata(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1 style={{ color: "red" }}>Error: {error}</h1>;
  }
  if (!data) {
    return <h1>No Data Found</h1>;
  }
  return (
    <div>
      <img src={data.images} alt={data.platform} style={{ width: "400px" }} />
      <p>{data.platform}</p>
      <p>{data.description}</p>
      <p>{data.price}₹</p>
      <button
        className="mt-8 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
        onClick={() => {
          fetch(`http://localhost:8080/prompt/${data._id}`, {
            method: "DELETE",
          }).then((res) => {
            if (res.ok) {
              console.log("delete");
              navigate("/");
            }
          });
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default Pagedetails;
