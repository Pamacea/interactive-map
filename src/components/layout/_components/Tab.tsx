"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "./Progress";
import Link from "next/link";
import { motion } from "framer-motion";

export const Tab = () => {
  return (
    <div className="h-9 text-chart-1 text-grenze text-center">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="flex justify-center items-center"
      >
        <Button variant="tab" size="tab" asChild>
          <Link href="/?hero">what it is</Link>
        </Button>
        <Button variant="tab" size="tab" asChild>
          <Link href="/?game">game</Link>
        </Button>
        <Button variant="tab" size="tab" asChild>
          <Link href="/?features">features</Link>
        </Button>
        <Button variant="tab" size="tab" asChild>
          <Link href="/?about">about</Link>
        </Button>
      </motion.div>
      <Progress />
    </div>
  );
};
