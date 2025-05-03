"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Infos } from "./_components/Infos";
import { Tab } from "./_components/Tab";
import { Label } from "../ui/label";

export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="h-12 border-b-2 border-border">
          {/* The header bar contains the interactive map button, membership button, globe icon, and info icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-row items-center justify-center px-8 sm:justify-between sm:px-16 md:px-32 font-jaini"
          >
            <Button variant="header" size="header" asChild>
              <Link href="/?hero" className="text-chart-1">interactive map</Link>
            </Button>
            <div className="flex w-fit">
              <Button variant="header" size="header" asChild>
               <Label className="text-chart-1">Membership</Label>
              </Button>
              <Button variant="btnheader" size="btnheader">
                <Globe className="w-4 h-4 text-chart-1" />
              </Button>
              <Infos />
              {/* Only for style */}
              <Button variant="btnheader" size="none" />
            </div>
          </motion.div>
        </div>
        {/* The tab bar contains the tabs, and the progress bar */}
        <Tab />
      </motion.div>
    </header>
  );
};
