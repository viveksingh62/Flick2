import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/leaderboard")
      .then((res) => res.json())
      .then((data) => setTopUsers(data.slice(0, 3))) // top 3 only
      .catch(console.error);
  }, []);

  // Gradient colors for top 3 ranks
  const colors = ["#3a3a76", "#2d2d5a", "#1f1f40"];

  return (
    <div
      className="mx-auto my-5 p-4 rounded-xl shadow-lg
                    bg-gradient-to-b from-[#3a3a76] via-[#2d2d5a] to-[#1f1f40]
                    w-full max-w-md text-center"
    >
      <h2 className="mb-4 text-lg sm:text-xl font-bold text-white">
        🏆 Top 3 Sellers
      </h2>
      <ul>
        <AnimatePresence>
          {topUsers.map((user, idx) => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`mb-3 p-3 rounded-lg font-bold text-white shadow-md`}
              style={{ backgroundColor: colors[idx] }}
            >
              #{idx + 1} {user.username} — {user.score} pts
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default Leaderboard;
