import React from "react";
import { Link } from "react-router-dom"; // 👈 import Link

function Card({ data }) {
  const shortDesc = data.description
    ? data.description.split(" ").slice(0, 6).join(" ") + "..."
    : "";

  return (
    <Link
      to={`/prompt/${data._id}`} // 👈 redirects to details page with ID
      className=" bg-[#DCFCE7] w-64 sm:w-72 rounded-xl border shadow-md p-3 flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-lg mb-3">
        <img
          className="aspect-[4/3] object-cover w-full hover:scale-105 transition-transform duration-300"
          src={data.images}
          alt={data.platform || "Prompt"}
        />
      </div>

      {/* Text + Price container */}
      <div className="flex flex-col flex-grow">
        {/* Platform name (optional) */}
        {data.platform && (
          <h2 className="text-sm font-semibold text-green-800 mb-1">
            {data.platform}
          </h2>
        )}

        {/* Description */}
        <p className="text-teal-800 text-sm mb-2 font-medium">{shortDesc}</p>

        {/* Price at bottom */}
        <div className="mt-auto">
          <p className="text-md font-semibold text-emerald-900">
            ₹{data.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
