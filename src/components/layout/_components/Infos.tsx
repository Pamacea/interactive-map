import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Info } from "lucide-react";
import Link from "next/link";

export const Infos = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="btnheader" size="btnheader">
          <Info className="w-4 h-12 text-chart-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 bg-card border-2 border-border mt-10">
        <DropdownMenuLabel className="flex justify-center items-center w-full uppercase text-3xl text-chart-2 font-bold font-jaini ">
          INFOS
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className=" flex flex-col justify-center items-center gap-2 p-2 ">
          <DropdownMenuItem asChild>
            <Button
              className="bg-transparent hover:bg-accent w-full uppercase text-lg text-chart-1 font-bold font-grenze"
              asChild
            >
              <Link href="https://github.com/Pamacea" target="_blank">
                GITHUB
              </Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="bg-transparent hover:bg-accent w-full uppercase text-lg text-chart-1 font-bold font-grenze"
              asChild
            >
              <Link
                href="https://www.linkedin.com/in/yanis-dessaint"
                target="_blank"
              >
                LINKEDIN
              </Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="bg-transparent hover:bg-accent w-full uppercase text-lg text-chart-1 font-bold font-grenze"
              asChild
            >
              <a href="mailto:pamacea@livefr">CONTACT</a>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
