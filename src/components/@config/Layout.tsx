export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-full min-h-screen">
        {children}
    </main>
  )
}