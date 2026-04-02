import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  value: number;
  duration?: number;
}

export default function CountUp({ value, duration = 2 }: Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value]);

  return (
    <motion.span>
      {rounded}
    </motion.span>
  );
}