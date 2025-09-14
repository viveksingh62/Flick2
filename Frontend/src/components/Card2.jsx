import React from "react";
import { Link } from "react-router-dom";

function Card2({ data }) {
  const shortDesc = data.description
    ? data.description.split(" ").slice(0, 12).join(" ") + "..."
    : "";

  return (
    <Link
      to={`/prompt/${data._id}`}
      className="bg-[#1a1a2e] rounded-lg border border-gray-700 shadow-md p-2 flex flex-row hover:shadow-lg transition-shadow duration-200 cursor-pointer w-full max-w-md h-20"
    >
      {/* Image on left */}
      <div className="w-20 h-full overflow-hidden rounded-md flex-shrink-0 mr-3">
        <img
          src={data.images}
          alt={data.platform || "Prompt"}
          className="w-full h-full object-cover object-center rounded-md"
        />
      </div>

      {/* Text on right */}
      <div className="flex flex-col justify-between flex-1 overflow-hidden">
        {data.platform && (
          <h2 className="text-[20px]font-semibold text-[#f7fafc] truncate">
            {data.platform}
          </h2>
        )}
        <p className="text-[#cbd5e0] text-[15px] truncate">{shortDesc}</p>
        <p className="text-xs font-semibold text-[#fff] mt-auto truncate">
          ₹{data.price}
        </p>
      </div>
    </Link>
  );
}

export default Card2;
