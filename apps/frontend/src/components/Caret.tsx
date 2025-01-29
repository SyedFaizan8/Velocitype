import { motion } from "framer-motion";
import { State } from "@/hooks/useEngine";

const Caret = ({ state }: { state: State }) => {

  const isBlinking = state !== "run";

  return (
    <motion.div
      aria-hidden={true}
      initial={{ opacity: 1 }}
      animate={isBlinking ? { opacity: 0 } : {}}
      exit={isBlinking ? { opacity: 1 } : {}}
      transition={isBlinking ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : {}}
      className={`inline-block bg-yellow-500 w-[3px] md:h-7 h-5`}
    />
  )
};

export default Caret;
