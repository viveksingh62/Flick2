import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#16213e] text-white py-6 w-full mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 px-4">
        {/* Social Icons */}
        <div className="flex gap-6 text-2xl">
          <a
            href="https://github.com/viveksingh62/Flick2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/vivek-singh-1a8a57257/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com/vivek_singh1212/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=vs7492403@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaEnvelope />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400 text-center md:text-right mt-2 md:mt-0">
          &copy; {new Date().getFullYear()} Promptflick. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
