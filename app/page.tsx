import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col overflow-hidden bg-white">
        <ContainerScroll
          titleComponent={
            <div className="max-w-4xl mx-auto pb-8 text-center">
              <div className="mb-6 inline-block">
                <span className="bg-blue-100/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-blue-100 flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  New: AI-Powered Finance Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Smart Solutions to <span className="inline-flex items-center text-blue-600"><Zap className="fill-current w-8 h-8 md:w-12 md:h-12 mr-1" /></span>Boost <br />
                Your Financial Life.
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Catat pengeluaran, atur tabungan, dan pantau langganan otomatis. Semua dalam satu dashboard modern dengan AI yang siap bantu kapan aja.
              </p>
              <div className="flex justify-center">
                <Link href="/register">
                  <button className="group relative flex items-center gap-4 bg-blue-50/80 hover:bg-blue-100/50 transition-all rounded-full p-1.5 pl-6 md:pl-8 pr-1.5 border border-blue-100 shadow-sm overflow-hidden">
                    <span className="text-base md:text-lg font-bold text-blue-600 tracking-tight">
                      Get Started Free
                    </span>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          }
        >
          <Image
            src="/dashboard.png"
            alt="hero"
            fill
            className="object-cover"
            draggable={false}
            priority
          />
        </ContainerScroll>
      </div>



      <Footer />
    </main>
  )
}
