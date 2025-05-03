"use client";

import { Globe, Info } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Tab } from "./_components/Tab";

export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
        <div className="h-12 border-b-2 border-border">
          {/* The header bar contains the interactive map button, membership button, globe icon, and info icon */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="flex flex-row items-center justify-center px-8 sm:justify-between sm:px-16 md:px-32 font-jaini">
            <Button variant="header" size="header">
              interactive map
            </Button>
            <div className="flex w-fit">
              <Button variant="header" size="header">membership</Button>
              <Button variant="btnheader" size="btnheader">
                <Globe className="w-4 h-4 text-chart-1" />
              </Button>
              <Button variant="btnheader" size="btnheader">
                <Info className="w-4 h-4 text-chart-1" />
              </Button>
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
