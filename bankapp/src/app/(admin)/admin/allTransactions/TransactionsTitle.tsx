"use client";

import { motion } from "framer-motion";

export default function TransactionsTitle() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "35px",
        marginBottom: "30px",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        style={{
          position: "relative",
          fontSize: "32px",
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-1px",
          paddingBottom: "12px",
          cursor: "default",
        }}
      >
        All Users' Transactions
        {/* Animated underline */}
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
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
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
