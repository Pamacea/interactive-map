"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSection } from "@/store/section.store";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion, useInView } from "framer-motion";

export const NextChapter = () => {
  const { section } = useSection();
  const router = useRouter();
  // Play animation when element is in view
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const nextSection = useCallback(() => {
    switch (section) {
      case "hero":
        return "game";
      case "game":
        return "features";
      case "features":
        return "about";
      case "about":
        return "hero";
      default:
        return "hero";
    }
  }, [section]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

      if (scrolledToBottom) {
        router.push(`/?${nextSection()}`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextSection, router]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <div className="w-full flex flex-col items-center justify-center gap-8 py-8">
        <div className="h-0.5 w-1/4 bg-chart-3" />
        <h2 className="text-2xl text-chart-2 font-jaini uppercase">
          {section === "about" ? "Chapter One" : "Next Chapter"}
        </h2>
        <h1 className="text-6xl text-chart-1 font-grenze uppercase">
          {nextSection()}
        </h1>
      </div>
      <div className="relative">
        <Button
          className="flex justify-center items-center bg-chart-2 rounded-full w-16 h-16"
          asChild
        >
          <Link href={`/?${nextSection()}`}>
            <ChevronDown className="w-9 h-9 text-chart-1 mb-4" />
          </Link>
        </Button>
        <div className="absolute w-full h-7 bg-background bottom-0" />
      </div>
    </motion.div>
  );
};
