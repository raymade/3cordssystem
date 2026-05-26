import React, { useEffect } from "react";
import { animate, useMotionValue, useTransform, motion } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: AnimatedNumberProps) {
  const count = useMotionValue(0);

  const formatted = useTransform(count, (latest) => {
    const formattedNum = latest.toFixed(decimals);
    const parts = formattedNum.split(".");
    // Insert comma separators for thousands
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${prefix}${parts.join(".")}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{formatted}</motion.span>;
}
