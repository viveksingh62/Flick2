import React from "react";

export default function LandingHeadline() {
  const text =
    "Discover the power of AI with ready-to-use prompts. Create, customize, and share smarter solutions.";

  const words = text.split(" ");

  return (
    <>
      <h1 className="headline">
        {words.map((word, idx) => (
          <span
            key={idx}
            className="fade-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {word}&nbsp;
          </span>
        ))}
      </h1>

      <style>
        {`
          /* Font and responsive text */
          .headline {
            font-family: 'Poppins', sans-serif;
            font-weight: 400; /* lighter weight */
            font-size: 1.2rem; /* slightly smaller */
            line-height: 1.5rem;
            color: white;
            display: inline-block;
            margin-bottom: 1.5rem;
            position: relative;
          }
          @media(min-width: 640px) { .headline { font-size: 1.4rem; line-height: 1.75rem; } }
          @media(min-width: 768px) { .headline { font-size: 1.625rem; line-height: 2rem; } }
          @media(min-width: 1024px) { .headline { font-size: 1.875rem; line-height: 2.25rem; } }

          /* Fade-up animation for each word */
          .fade-up {
            opacity: 0;
            transform: translateY(20px);
            display: inline-block;
            animation: fadeUp 0.5s ease forwards;
          }

          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* Gradient underline animation */
          .headline::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #10B981, #3B82F6);
            animation: underlineGrow 2s ease forwards 0.5s;
          }
          @keyframes underlineGrow {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </>
  );
}
