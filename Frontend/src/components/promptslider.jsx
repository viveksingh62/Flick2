import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // ✅ Correct import

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Card from "./Card";

export default function PromptSlider() {
  const [prompts, setPrompts] = useState([]);
 const API_URL = import.meta.env.VITE_BACKEND_URL;
  const colors = ["#3a3a76", "#2d2d5a", "#fff"]; // your colors

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${API_URL}/`);
        const data = await res.json();
        setPrompts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <div className="my-6 relative">
      <h2 className="text-white text-xl mb-4">🔥 Featured Prompts</h2>

      {/* Custom Arrow Styling */}
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: ${colors[2]}; /* Pick a color from your array */
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {prompts.slice(0, 20).map((prompt) => (
          <SwiperSlide
            key={prompt._id}
            className="!h-auto !w-auto flex justify-center"
          >
            <div className="w-56 md:w-60 lg:w-64 h-auto">
              <Card data={prompt} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
