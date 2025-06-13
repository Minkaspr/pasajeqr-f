export default function CustomerLayout (
  { children }: Readonly<{ children: React.ReactNode }>
) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Customer Layout</h1>
      {children}
      Hola :D 
    </div>
  )
}