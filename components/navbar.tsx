"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isAboutSection, setIsAboutSection] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const aboutSection = document.getElementById("about-section")
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect()
        // Sticky section is active when top is <= 0 and bottom is >= 0
        setIsAboutSection(rect.top <= 0 && rect.bottom >= 0)
      } else {
        setIsAboutSection(false)
      }
    }
    window.addEventListener("scroll", handleScroll)

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAboutSection
          ? "bg-white border-b border-gray-100 shadow-sm"
          : scrolled
            ? "bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "bg-transparent border-b border-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
            <Image
              src="/cashmind-logo2.png"
              alt="CashMind Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className={`text-2xl font-semibold tracking-tight transition-colors ${isAboutSection ? "text-black" : "text-gray-900 dark:text-white"
            }`}>
            CashMind
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500">
          {[
            { name: "About", href: "/about" },
            { name: "Features", href: "/features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Contact Us", href: "#contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 rounded-full transition-all ${isAboutSection
                  ? "text-black hover:bg-gray-100"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <motion.button
                initial="initial"
                whileHover="hover"
                className="group relative flex items-center bg-blue-600 hover:bg-blue-700 transition-all rounded-full px-8 h-10 shadow-lg shadow-blue-200 overflow-hidden gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <div className="relative h-5 overflow-hidden pointer-events-none">
                  <motion.div
                    variants={{
                      initial: { y: 0 },
                      hover: { y: "-50%" }
                    }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col"
                  >
                    <span className="text-sm font-bold text-white tracking-tight h-5 flex items-center">
                      Dashboard
                    </span>
                    <span className="text-sm font-bold text-white tracking-tight h-5 flex items-center">
                      Dashboard
                    </span>
                  </motion.div>
                </div>
              </motion.button>
            </Link>
          ) : (
            <>
              {/* Login Button (Ghost style) */}
              <Link href="/login">
                <motion.button
                  initial="initial"
                  whileHover="hover"
                  className={`group relative hidden sm:flex items-center justify-center transition-all rounded-full px-6 h-10 overflow-hidden ${isAboutSection ? "bg-transparent hover:bg-gray-100" : "bg-transparent hover:bg-gray-50"
                    }`}
                >
                  <div className="relative h-5 overflow-hidden pointer-events-none">
                    <motion.div
                      variants={{
                        initial: { y: 0 },
                        hover: { y: "-50%" }
                      }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col"
                    >
                      <span className={`text-sm font-bold tracking-tight h-5 flex items-center transition-colors ${isAboutSection ? "text-black" : "text-gray-600"
                        }`}>
                        Login
                      </span>
                      <span className={`text-sm font-bold tracking-tight h-5 flex items-center transition-colors ${isAboutSection ? "text-black/70" : "text-blue-600"
                        }`}>
                        Login
                      </span>
                    </motion.div>
                  </div>
                </motion.button>
              </Link>

              {/* Register Button (Solid style) */}
              <Link href="/register">
                <motion.button
                  initial="initial"
                  whileHover="hover"
                  className="group relative flex items-center bg-blue-600 hover:bg-blue-700 transition-all rounded-full px-8 h-10 shadow-lg shadow-blue-200 overflow-hidden"
                >
                  <div className="relative h-5 overflow-hidden pointer-events-none">
                    <motion.div
                      variants={{
                        initial: { y: 0 },
                        hover: { y: "-50%" }
                      }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col"
                    >
                      <span className="text-sm font-bold text-white tracking-tight h-5 flex items-center">
                        Register
                      </span>
                      <span className="text-sm font-bold text-white tracking-tight h-5 flex items-center">
                        Register
                      </span>
                    </motion.div>
                  </div>
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
