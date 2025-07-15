'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AboutModal from './AboutModal'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToExplore = (e) => {
    e.preventDefault()
    const exploreSection = document.querySelector('[data-section="explore"]')
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openAboutModal = (e) => {
    e.preventDefault()
    setIsAboutModalOpen(true)
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4 flex justify-end items-center">
          <div className="flex space-x-8">
            <a 
              href="#explore" 
              onClick={scrollToExplore}
              className="text-gray-700 hover:text-blue-700 transition-colors font-medium cursor-pointer"
            >
              Explore
            </a>
            <a 
              href="#about" 
              onClick={openAboutModal}
              className="text-gray-700 hover:text-blue-700 transition-colors font-medium cursor-pointer"
            >
              About
            </a>
          </div>
        </div>
      </nav>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </>
  )
} 