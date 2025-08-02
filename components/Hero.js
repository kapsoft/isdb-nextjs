'use client'

import { useEffect, useRef, useState } from 'react'
import ThreeAnimation from './ThreeAnimation'
import FootballAnimation from './FootballAnimation'
import Logo from './Logo'
import Confetti from './Confetti'

export default function Hero() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState('basketball') // Toggle state
  const searchTimeoutRef = useRef(null)

  const handleStartClick = () => {
    setShowSearch(true)
    
    // If confetti isn't already showing, trigger it
    if (!showConfetti) {
      setShowConfetti(true)
      
      // Stop confetti after 45 seconds
      searchTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false)
      }, 45000)
    }
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
    // Trigger confetti after 30 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true)
      
      // Stop confetti after 45 seconds
      searchTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false)
      }, 45000)
    }, 30000)

    return () => {
      clearTimeout(confettiTimer)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Three.js Animation Container */}
      <div className="absolute inset-0 z-0">
        {currentAnimation === 'basketball' ? <ThreeAnimation /> : <FootballAnimation />}
      </div>
      
      {/* Animation Toggle Button */}
      <button
        onClick={() => setCurrentAnimation(prev => prev === 'basketball' ? 'football' : 'basketball')}
        className="absolute top-20 right-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all hover:scale-105 text-sm font-medium text-gray-700"
      >
        {currentAnimation === 'basketball' ? '🏈 Switch to Football' : '🏀 Switch to Basketball'}
      </button>
      
      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6" style={{ paddingTop: 'calc(2vh - 5px)', marginTop: '-55vh' }}>
        <div className="mb-3">
          <Logo 
            size="large" 
            className="justify-center" 
            backgroundTransparent={currentAnimation === 'football'}
          />
        </div>
        <p className={`text-2xl md:text-3xl mb-1 font-light ${
          currentAnimation === 'football' ? 'text-white' : 'text-gray-700'
        }`}>
          Internet Sports Data Base
        </p>
        <p className={`text-lg md:text-xl mb-7 max-w-2xl mx-auto ${
          currentAnimation === 'football' ? 'text-white' : 'text-gray-600'
        }`}>
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