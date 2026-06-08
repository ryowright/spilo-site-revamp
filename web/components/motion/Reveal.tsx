"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import {
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_EASE,
} from "./transitions";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  distance?: number;
  /** Override the slide axis (default: y). */
  axis?: "x" | "y";
};

/**
 * Single-element reveal: fades and slides in once when scrolled into view.
 * Above-the-fold elements animate on first paint because they're already in view.
 */
export function Reveal({
  children,
  delay = 0,
  distance = REVEAL_DISTANCE,
  axis = "y",
  ...rest
}: RevealProps) {
  const offset = axis === "y" ? { y: distance } : { x: distance };
  const target = axis === "y" ? { y: 0 } : { x: 0 };
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, ...target }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
