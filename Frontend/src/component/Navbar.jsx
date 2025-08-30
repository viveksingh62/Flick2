import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#0A2540] text-white px-6 py-3 shadow-md flex items-center justify-between rounded-lg mb-20">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-full h-13" />
        </div>

        {/* Search (hidden on small screens) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 pr-10 rounded-lg border border-gray-300 bg-emerald-50/7
                focus:outline-none focus:ring-2 focus:ring-indigo-400 transition w-full"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/prompt" className="px-4 py-1 rounded-lg hover:bg-white/10">Create</Link>
          <Link to="/categories" className="px-4 py-1 rounded-lg hover:bg-white/10">Categories</Link>
          <Link to="/about" className="px-4 py-1 rounded-lg hover:bg-white/10">About</Link>

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
            <button
              onClick={logout}
              className="px-4 py-1 text-white font-medium rounded-lg hover:bg-white/10 transition"
            >
              Logout
            </button>
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

        {/* Sidebar Links */}
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/prompt" className="text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>Create</Link>
          <Link to="/categories" className="text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link to="/about" className="text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>About</Link>

          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="px-4 py-2 text-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition" onClick={() => setIsOpen(false)}>Signup</Link>
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

      {/* Dark overlay when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
