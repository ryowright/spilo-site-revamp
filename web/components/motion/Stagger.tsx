"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import {
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_EASE,
  STAGGER,
} from "./transitions";

/**
 * Item variants for direct children of <Stagger>. Children should be motion
 * components with `variants={staggerItem}` so they inherit "hidden" / "show"
 * from the parent's animation state.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE },
  },
};

type StaggerProps = HTMLMotionProps<"div"> & {
  /** Gap between siblings in seconds (default 0.06). */
  gap?: number;
  /** Delay before the first child animates (default 0). */
  delayChildren?: number;
};

export function Stagger({
  children,
  gap = STAGGER,
  delayChildren = 0,
  ...rest
}: StaggerProps) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={container}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
