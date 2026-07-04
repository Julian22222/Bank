"use client";

import { motion } from "framer-motion";

interface AdminTitleProps {
  title: string;
  num: number;
}

export default function AdminTitle({ title, num }: AdminTitleProps) {
  return (
    <div className="d-flex justify-content-center my-4">
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="position-relative fw-bold text-dark"
        style={{
          fontSize: "32px",
          letterSpacing: "-1px",
          paddingBottom: "12px",
          cursor: "default",
        }}
      >
        {num} {title}
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            delay: 0.4,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: "4px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)",
          }}
        />
        {/* Glow effect */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: "absolute",
            inset: 0,
            filter: "blur(18px)",
            zIndex: -1,
            background:
              "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
          }}
        />
      </motion.h2>
    </div>
  );
}
