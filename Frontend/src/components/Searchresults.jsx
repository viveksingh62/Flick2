import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar"; // adjust path
import Card from "./Card"; // your existing card component

export default function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:8080/search?q=${query}`);
        const data = await res.json();
        setResults(data); // assuming data is an array of prompts
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Navbar /> {/* Navbar always visible */}
      <div className="px-6 py-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Search results for: <span className="text-white">{query}</span>
        </h2>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((data) => (
              <Card key={data._id} data={data} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No results found.</p>
        )}
      </div>
    </>
  );
}
