"use client";

import { AnimatePresence, motion } from "framer-motion";

export function FieldError({
  show,
  message,
}: {
  show: boolean;
  message: string | undefined;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.p
          key="field-error"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-xs text-red-500 overflow-hidden"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
