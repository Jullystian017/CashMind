"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isAboutSection, setIsAboutSection] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const aboutSection = document.getElementById("about-section")
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect()
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAboutSection
          ? "bg-white border-b border-gray-100 shadow-sm"
          : scrolled || isMobileMenuOpen
            ? "bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "bg-transparent border-b border-transparent"
          }`}
      >
        <nav className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 py-5 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group z-20">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
              <Image
                src="/cashmind-logo2.png"
                alt="CashMind Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`text-2xl font-semibold tracking-tight transition-colors ${isAboutSection || scrolled || isMobileMenuOpen ? "text-black" : "text-gray-900 dark:text-white"
              }`}>
              CashMind
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full transition-all ${isAboutSection || scrolled ? "text-black hover:bg-gray-100" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons (Desktop) + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
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
                        <span className="text-sm font-semibold text-white tracking-tight h-5 flex items-center">
                          Dashboard
                        </span>
                        <span className="text-sm font-semibold text-white tracking-tight h-5 flex items-center">
                          Dashboard
                        </span>
                      </motion.div>
                    </div>
                  </motion.button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <motion.button
                      initial="initial"
                      whileHover="hover"
                      className={`group relative hidden sm:flex items-center justify-center transition-all rounded-full px-6 h-10 overflow-hidden ${isAboutSection || scrolled ? "bg-transparent hover:bg-gray-100" : "bg-transparent hover:bg-gray-50"
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
                          <span className={`text-sm font-semibold tracking-tight h-5 flex items-center transition-colors ${isAboutSection || scrolled ? "text-black" : "text-gray-600"
                            }`}>
                            Login
                          </span>
                          <span className={`text-sm font-semibold tracking-tight h-5 flex items-center transition-colors ${isAboutSection || scrolled ? "text-black/70" : "text-blue-600"
                            }`}>
                            Login
                          </span>
                        </motion.div>
                      </div>
                    </motion.button>
                  </Link>
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
                          <span className="text-sm font-semibold text-white tracking-tight h-5 flex items-center">
                            Register
                          </span>
                          <span className="text-sm font-semibold text-white tracking-tight h-5 flex items-center">
                            Register
                          </span>
                        </motion.div>
                      </div>
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all z-20 ${isAboutSection || scrolled || isMobileMenuOpen ? "text-black bg-gray-100 hover:bg-gray-200" : "text-gray-900 bg-gray-50 border border-gray-100 hover:bg-gray-100"
                }`}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-10 flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                  {navLinks.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center justify-between py-2 group"
                      >
                        {item.name}
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                  {user ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg shadow-blue-200">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-lg font-semibold hover:bg-gray-100">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg shadow-blue-200">
                          Register Now
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
