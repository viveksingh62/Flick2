import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../component/Card";
import Navbar from "../component/Navbar";
export default function CategoryPage() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const res = await fetch(`http://localhost:8080/categories/${category}`);
      const data = await res.json();
      setPrompts(data);
    };
    fetchPrompts();
  }, [category]);

  return (
    <div className="p-6">
      <Navbar />
      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-5 ">
        {prompts.map((item) => (
          <Card key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
}
