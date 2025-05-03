"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSection } from "@/store/section.store";
import { Game } from "./Game";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { About } from "./About";

export const Home = () => {
  // Store initialization
  const { section, setSection } = useSection();
  // Get query(url) params
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if url has query params 
  const hero = searchParams.has("hero");
  const game = searchParams.has("game");
  const features = searchParams.has("features");
  const about = searchParams.has("about");

  // If url has query params, redirect to that section
  useEffect(() => {
    if (hero) {
      setSection("hero");
    } else if (game) {
      setSection("game");
    } else if (features) {
      setSection("features");
    } else if (about) {
      setSection("about");
    }
  }, [searchParams, setSection, section, router, hero, game, features, about]);

  // If url has query params, redirect to that section
  return (
    <>
      {section === "hero" && <Hero />}
      {section === "game" && <Game />}
      {section === "features" && <Features />}
      {section === "about" && <About />}
    </>
  );
};
