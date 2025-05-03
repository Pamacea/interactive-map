import { Header } from "./Header";
import { NextChapter } from "./NextChapter";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="grow">{children}</main>
      <NextChapter />
    </div>
  );
};
