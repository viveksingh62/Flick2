import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../component/Card";

export default function Homepage() {
  let [data, setdata] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => res.json())
      .then((data) => setdata(data))
      .catch((err) => console.log(err));
  }, []);

  return (  
    <div className="p-6">
      <Link
        to={`/prompt`}
        className="inline-block mb-6 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 "
      >
        Add new data
      </Link>

      {/* Card Grid */}
      <div className="grid gap-6 justify-items-center sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-5">
        {data.map((item) => (
          <Card key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
}
