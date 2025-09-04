import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../component/Card";
import Navbar from "../component/Navbar";

export default function Homepage() {
  let [data, setdata] = useState([]);

  const setSearchResults = (results) => {
    if (results.length === 0) {
      // if nothing found → reload homepage
      fetchAllPrompts();
    } else {
      setdata(results);
    }
  };
  const fetchAllPrompts = async () => {
    const res = await fetch("http://localhost:8080/");
    const all = await res.json();
    setdata(all);
  };
  useEffect(() => {
    fetchAllPrompts();
  }, []);
  return (
    <div className="p-6">
      <Navbar setSearchResults={setSearchResults} />

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-5 ">
        {data.map((item) => (
          <Card key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
}
