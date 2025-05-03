
import { Button } from "@/components/ui/button";
import { Progress } from "./Progress";
import Link from "next/link";

export const Tab = () => {


  return (
    <div className="h-9 text-chart-1 text-grenze text-center">
      <div className="flex justify-center items-center">
        <Button variant="tab" size="tab" asChild>
          <Link href="/?hero">what it is</Link>
        </Button>
        <Button variant="tab" size="tab" asChild>
        <Link href="/?game">game</Link>
        </Button>
        <Button variant="tab" size="tab" asChild >
        <Link href="/?features" >features</Link>
        </Button>
        <Button variant="tab" size="tab" asChild>
        <Link href="/?about">about</Link>
        </Button>
      </div>
      <Progress />
    </div>
  );
};
