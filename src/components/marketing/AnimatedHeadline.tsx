"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045 },
  },
};

const word = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function AnimatedHeadline({
  text,
  className,
  gradientWords = [],
}: {
  text: string;
  className?: string;
  gradientWords?: string[];
}) {
  const words = text.split(" ");

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`mr-[0.28em] inline-block ${
            gradientWords.includes(w.replace(/[.,!?]/g, "")) ? "text-gradient" : ""
          }`}
        >
          {w}
        </motion.span>
      ))}
    </motion.h1>
  );
}
