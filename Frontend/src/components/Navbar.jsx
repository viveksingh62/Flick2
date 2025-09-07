import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";

export default function Navbar({ setSearchResults }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // 🔎 Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const res = await fetch(`http://localhost:8080/search?q=${query}`);
    const data = await res.json();
    setSearchResults(data); // Pass results back to Homepage
  };

  // Category options
  const categoryOptions = [
    { value: "ChatGPT", label: "ChatGPT" },
    { value: "Gemini", label: "Gemini" },
    { value: "Claude", label: "Claude" },
    { value: "Midjourney", label: "Midjourney" },
    { value: "Stable Diffusion", label: "Stable Diffusion" },
    { value: "DALL·E", label: "DALL·E" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle category change
  const handleCategoryChange = (selected) => {
    setSelectedCategory(selected);
    if (selected) {
      // Redirect to category page or call API filter
      setTimeout(() => {
        window.location.href = `/categories/${selected.value}`;
      }, 200);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#2a2a54] text-white px-6 py-3 shadow-md flex items-center justify-between rounded-lg mb-8">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-13 cursor-pointer"
            />
          </Link>
        </div>

        {/* Search (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-1/2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 pr-10 rounded-lg border border-gray-300 w-full text-white"
            />
            <button type="submit">
              <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/prompt" className="px-4 py-1 rounded-lg hover:bg-white/10">
            Create
          </Link>

          {/* Category Dropdown (Desktop) */}
          <div className="hidden md:flex w-48 mx-4">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select Category"
              isSearchable={false} // ✅ disable typing, only dropdown
              menuPortalTarget={document.body}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  backgroundColor: "#0A2540",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "2px 6px",
                  minHeight: "38px",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "rgba(255,255,255,0.6)",
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  backgroundColor: "#0A2540",
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "#10B981" // emerald green
                    : isFocused
                      ? "rgba(16, 185, 129, 0.3)"
                      : "transparent",
                  color: "white",
                  cursor: "pointer",
                }),
              }}
            />
          </div>

          <Link to="/about" className="px-4 py-1 rounded-lg hover:bg-white/10">
            About
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1 text-white font-medium rounded-lg hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 text-white font-medium rounded-lg hover:bg-white/10 transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={logout}
                className="px-4 py-1 text-white font-medium rounded-lg hover:bg-white/10 transition"
              >
                Logout
              </button>
              <Link
                to="/my-purchases"
                className="px-4 py-1 text-white font-medium rounded-lg hover:bg-white/10 transition"
              >
                My Purchases
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </nav>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold text-emerald-600">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col p-4 space-y-4">
          {/* 🔎 Search inside sidebar (mobile) */}
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 pr-10 rounded-lg border border-gray-300 w-full text-black"
            />
            <button type="submit">
              <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            </button>
          </form>

          {/* Category Dropdown (Mobile) */}
          <div className="w-full">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select Category"
              isSearchable={false} //  only dropdown, no typing
              menuPortalTarget={document.body} // ✅ render at root level
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  backgroundColor: "#0A2540",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "2px 6px",
                  minHeight: "38px",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "rgba(255,255,255,0.6)",
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999, // ✅ ensures dropdown stays above navbar
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999, // ✅ ensures dropdown stays above overlay
                  backgroundColor: "#0A2540",
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "#10B981" // emerald green
                    : isFocused
                      ? "rgba(16, 185, 129, 0.3)"
                      : "transparent",
                  color: "white",
                  cursor: "pointer",
                }),
              }}
            />
          </div>

          <Link
            to="/prompt"
            className="text-gray-700 hover:text-emerald-600"
            onClick={() => setIsOpen(false)}
          >
            Create
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-emerald-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Dark overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
