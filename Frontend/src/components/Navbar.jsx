import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryOptions = [
    { value: "ChatGPT", label: "ChatGPT" },
    { value: "Gemini", label: "Gemini" },
    { value: "Claude", label: "Claude" },
    { value: "Midjourney", label: "Midjourney" },
    { value: "Stable Diffusion", label: "Stable Diffusion" },
    { value: "DALL·E", label: "DALL·E" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleCategoryChange = (selected) => {
    setSelectedCategory(selected);
    if (selected) navigate(`/categories/${selected.value}`);
    setIsOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#2a2a54] text-white px-4 py-2 shadow-md flex items-center justify-between rounded-lg mb-8">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="w-32 h-10 cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
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
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/prompt" className="px-4 py-1 rounded-lg hover:bg-white/10">Create</Link>
          <div className="w-48">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select Category"
              isSearchable={false}
              menuPortalTarget={document.body}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  backgroundColor: "#0A2540",
                  borderColor: "rgba(255,255,255,0.2)",
                  padding: "2px 6px",
                  minHeight: "38px",
                }),
                singleValue: (base) => ({ ...base, color: "white" }),
                placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.6)" }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999, backgroundColor: "#0A2540" }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? "#10B981" : isFocused ? "rgba(16, 185, 129, 0.3)" : "transparent",
                  color: "white",
                  cursor: "pointer",
                }),
              }}
            />
          </div>
          <Link to="/about" className="px-4 py-1 rounded-lg hover:bg-white/10">About</Link>
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-1 rounded-lg hover:bg-white/10">Login</Link>
              <Link to="/signup" className="px-4 py-1 rounded-lg hover:bg-white/10">Signup</Link>
            </>
          ) : (
            <>
              <button onClick={logout} className="px-4 py-1 rounded-lg hover:bg-white/10">Logout</button>
              <Link to="/my-purchases" className="px-4 py-1 rounded-lg hover:bg-white/10">
                <FontAwesomeIcon icon={faUser} /> My Profile
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold text-emerald-600">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          {/* Mobile Search Box inside sidebar */}
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 pr-10 rounded-lg border border-gray-300 w-full text-black bg-[#f0f0f0]"
            />
            <button type="submit">
              <Search className="absolute right-2 top-2 text-gray-600 w-4 h-4" />
            </button>
          </form>

          {/* Profile button */}
          {user && (
            <Link
              to="/my-purchases"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-white bg-emerald-500 rounded-lg text-center"
            >
              <FontAwesomeIcon icon={faUser} /> My Profile
            </Link>
          )}

          {/* Mobile Links */}
          <button onClick={() => handleNavClick("/prompt")} className="text-gray-700 hover:text-emerald-600">Create</button>
          <button onClick={() => handleNavClick("/about")} className="text-gray-700 hover:text-emerald-600">About</button>

          {/* Mobile Category Dropdown */}
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            isSearchable={false}
            menuPortalTarget={document.body}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.5rem",
                backgroundColor: "#0A2540",
                borderColor: "rgba(255,255,255,0.2)",
                padding: "2px 6px",
                minHeight: "38px",
              }),
              singleValue: (base) => ({ ...base, color: "white" }),
              placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.6)" }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, zIndex: 9999, backgroundColor: "#0A2540" }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? "#10B981" : isFocused ? "rgba(16, 185, 129, 0.3)" : "transparent",
                color: "white",
                cursor: "pointer",
              }),
            }}
          />

          {!user ? (
            <>
              <button onClick={() => handleNavClick("/login")} className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Login</button>
              <button onClick={() => handleNavClick("/signup")} className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Signup</button>
            </>
          ) : (
            <button onClick={() => { logout(); setIsOpen(false); }} className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Logout</button>
          )}
        </div>
      </motion.div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setIsOpen(false)} />}
    </>
  );
}
