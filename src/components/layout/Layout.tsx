import { Header } from "./Header";
import { NextChapter } from "./NextChapter";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="grow py-16">{children}</main>
      <NextChapter />
    </div>
  );
};
