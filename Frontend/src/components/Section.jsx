import React, { useState } from "react";
import Card from "./Card2";

function Section({ title, items }) {
  const [visible, setVisible] = useState(6); // show first 6 items

  const handleViewMore = () => {
    setVisible((prev) => prev + 6); // load 6 more each click
  };

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {visible < items.length && (
          <button
            onClick={handleViewMore}
            className="text-blue-400 hover:underline text-sm"
          >
            View more →
          </button>
        )}
      </div>

      {/* Vertical list of cards */}
      <div className="space-y-4 ">
        {items.slice(0, visible).map((data) => (
          <Card key={data._id} data={data} />
        ))}
      </div>
    </div>
  );
}

export default Section;
