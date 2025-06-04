import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";

function AnimatedSection({ 
  children, 
  className,
  variants,
  threshold = 0.1,
  rootMargin = "50px",
  once = true
}: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    //@ts-expect-error Ignore
    threshold, 
    rootMargin,
    once 
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;