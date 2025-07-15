'use client'

import { useEffect, useRef, useState } from 'react'
import ThreeAnimation from './ThreeAnimation'
import Logo from './Logo'
import Confetti from './Confetti'

export default function Hero() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [showComingSoon, setShowComingSoon] = useState(false)
  const searchTimeoutRef = useRef(null)

  const handleStartClick = () => {
    setShowConfetti(true)
    setShowSearch(true)
    
    // Stop confetti after 45 seconds
    searchTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false)
    }, 45000)
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    setSearchValue(value)
    
    if (value.length > 0) {
      setShowComingSoon(true)
      setSearchValue("Coming soon!")
    } else {
      setShowComingSoon(false)
      setSearchValue("")
    }
  }

  const handleSearchFocus = () => {
    if (searchValue === "Coming soon!") {
      setSearchValue("")
      setShowComingSoon(false)
    }
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Three.js Animation Container */}
      <div className="absolute inset-0 z-0">
        <ThreeAnimation />
      </div>
      
      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6" style={{ paddingTop: 'calc(2vh - 5px)', marginTop: '-55vh' }}>
        <div className="mb-3">
          <Logo size="large" className="justify-center" />
        </div>
        <p className="text-2xl md:text-3xl mb-1 text-gray-700 font-light">
          Internet Sports Data Base
        </p>
        <p className="text-lg md:text-xl mb-7 max-w-2xl mx-auto text-gray-600">
          The ultimate AI-powered graph of sports data. 
          Discover connections between players, teams, and moments in sports history.
        </p>
        
        {!showSearch ? (
          <button 
            onClick={handleStartClick}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg"
          >
            Start Exploring
          </button>
        ) : (
          <div className="max-w-2xl mx-auto" style={{ marginTop: '-10px' }}>
            <input
              type="text"
              placeholder="Search for players, teams, moments, or stats..."
              value={searchValue}
              onChange={handleSearchInput}
              onFocus={handleSearchFocus}
              className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none shadow-lg bg-white/90 backdrop-blur-sm"
              autoFocus
            />
          </div>
        )}
      </div>
    </section>
  )
} 