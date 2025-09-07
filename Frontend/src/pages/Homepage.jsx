import { useEffect, useState } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import CircularGallery from "@/components/CircularGallery";
import PromptSlider from "@/components/promptslider";
import Leaderboard from "@/components/Leaderboard";
import Section from "@/components/Section";
import Card2 from "@/components/Card2";
export default function Homepage() {
  let [data, setdata] = useState([]);
  const [visible, setvisible] = useState([]);

  const setSearchResults = (results) => {
    if (results.length === 0) {
      fetchAllPrompts();
    } else {
      setdata(results);
    }
  };

  const fetchAllPrompts = async () => {
    const res = await fetch("http://localhost:8080/");
    const all = await res.json();
    setdata(all);
    setvisible(6);
  };

  useEffect(() => {
    fetchAllPrompts();
  }, []);

  const handleLoad = () => {
    setvisible((prev) => prev + 5);
  };

  return (
    <div className="p-4">
      <Navbar setSearchResults={setSearchResults} />

      <div className="mt-6">
        {/* Headline */}
        <h1 className="text-white text-base sm:text-lg leading-relaxed mb-6">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis
          tempore hic, provident eveniet velit enim excepturi animi et
          accusantium? Neque ab esse incidunt non atque nesciunt, unde id
          sapiente commodi. Lorem ipsum dolor sit amet consectetur
          adipisicing elit...
        </h1>
 <div className="my-8 ">
          <PromptSlider />
        </div>
        <h1 className="text-white text-xl mb-10 font-bold">Explore The Collections</h1>
        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {data.slice(0, visible).map((item) => (
            <Card key={item._id} data={item} />
          ))}
        </div>

{/* 🔥 Dark background Section block with 4 columns */}



        {visible < data.length && (
          <div className="flex justify-center">
            <button
              className="px-6 py-2 bg-[#0A2540] mt-5 text-white rounded-lg hover:bg-[#0F2F5A]"
              onClick={handleLoad}
            >
              Load More
            </button>
          </div>
        )}
        <div className=" py- px-6 rounded-lg my-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
    <Section title="Top Prompts" items={data.slice(0, 5)} />
    <Section title="Most Buyed" items={data.slice(5, 10)} />
    <Section title="Most Favorite" items={data.slice(10, 15)} />
    <Section title="New Collection" items={data.slice(15, 20)} />
  </div>
</div>

        {/* Circular Gallery */}
        <div className="my-10" style={{ height: "500px", position: "relative" }}>
          <CircularGallery
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </div>

        {/* Prompt Slider */}
       <div>
        <Leaderboard/>
       </div>
      </div>
    </div>
  );
}
