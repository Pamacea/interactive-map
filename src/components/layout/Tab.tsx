import { Button } from "../ui/button";
import { Progress } from "./_components/Progress";

export const Tab = () => {
  return (
    <div className="h-9 text-chart-1 text-grenze text-center">
      <div className="flex justify-center items-center px-2">
        <Button variant="tab" size="maintab">
          what it is ?
        </Button>
        <Button variant="tab" size="tab">
          game
        </Button>
        <Button variant="tab" size="tab">
          features
        </Button>
        <Button variant="tab" size="tab">
          about
        </Button>
      </div>
      <Progress />
    </div>
  );
};
