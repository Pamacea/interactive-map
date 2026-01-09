import { LayoutBackground } from "./LayoutBackground";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-full min-h-screen py-24">
      <LayoutBackground />
        {children}
    </main>
  )
}