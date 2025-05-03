import { Globe, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Tab } from "./Tab";

export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background">
      <div>
        <div className="h-12 border-b-2 border-border">
          {/* The header bar contains the interactive map button, membership button, globe icon, and info icon */}
          <div className="flex flex-row items-center justify-center px-8 sm:justify-between sm:px-16 md:px-32 font-jaini">
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
          </div>
        </div>
        {/* The tab bar contains the tabs, and the progress bar */}
        <Tab />
      </div>
    </header>
  );
};
