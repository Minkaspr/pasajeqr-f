import { PublicNavbar } from "@/components/public-navbar";

export default function PublicLayout (
  { children }: Readonly<{ children: React.ReactNode }>
) {
  return (
    <div>
      <header>
          <PublicNavbar />
      </header>
        {children}
    </div>
  )
}