import React from "react";
import { Link } from "react-router-dom"; // 👈 import Link

function Card({ data }) {
  if (!data) return null;
  const shortDesc = data.description
    ? data.description.split(" ").slice(0, 6).join(" ") + "..."
    : "";

  return (
    <Link
      to={`/prompt/${data._id}`} // 👈 redirects to details page with ID
      className=" bg-[#2d2d5a] w-full  rounded-xl border-emerald-200 shadow-md p-3 flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer "
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
          <h2 className="text-sm font-semibold text-white mb-1">
            {data.platform}
          </h2>
        )}

        {/* Description */}
        <p className="text-white text-sm mb-2 font-medium">{shortDesc}</p>

        {/* Price at bottom */}
        <div className="mt-auto">
          <p className="text-md font-semibold text-[#fff]">₹{data.price}</p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
