import { Navbar } from "@/components/navbar"
import Homepage from "@/components/homepage"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Homepage />
      <Footer />
    </main>
  )
}
