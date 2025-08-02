'use client'

import { useEffect, useRef, useState } from 'react'

export default function Confetti({ isActive }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const confettiRef = useRef([])
  const [isFading, setIsFading] = useState(false)
  const fadeStartTimeRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      // Start fade out when confetti becomes inactive
      if (confettiRef.current.length > 0 && !isFading) {
        setIsFading(true)
        fadeStartTimeRef.current = Date.now()
      }
      return
    }

    // Reset fade state when confetti becomes active again
    setIsFading(false)
    fadeStartTimeRef.current = null

    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Confetti piece class
    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = -10
        this.size = Math.random() * 8 + 4
        this.speedY = Math.random() * 3 + 2
        this.speedX = Math.random() * 2 - 1
        this.rotation = Math.random() * 360
        this.rotationSpeed = Math.random() * 4 - 2
        this.color = [
          '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
          '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ][Math.floor(Math.random() * 10)]
        this.shape = Math.random() > 0.5 ? 'square' : 'circle'
      }

      update() {
        this.y += this.speedY
        this.x += this.speedX
        this.rotation += this.rotationSpeed
        
        // Add some wind effect
        this.speedX += (Math.random() - 0.5) * 0.1
        this.speedX *= 0.99 // Air resistance
      }

      draw(fadeProgress = 0) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        
        // Calculate opacity based on fade progress and position
        let opacity = 1
        if (fadeProgress > 0) {
          // Create a gradient fade from top to bottom
          const fadeHeight = canvas.height * fadeProgress
          const fadeY = canvas.height - fadeHeight
          
          if (this.y < fadeY) {
            // Above fade line - fully visible
            opacity = 1
          } else {
            // Below fade line - fade out based on distance
            const distanceFromFade = this.y - fadeY
            const maxFadeDistance = fadeHeight
            opacity = Math.max(0, 1 - (distanceFromFade / maxFadeDistance))
          }
        }
        
        ctx.globalAlpha = opacity
        ctx.fillStyle = this.color
        if (this.shape === 'square') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()
      }

      isOffScreen() {
        return this.y > canvas.height + 20
      }
    }

    // Create initial confetti
    const createConfetti = () => {
      for (let i = 0; i < 5; i++) {
        confettiRef.current.push(new ConfettiPiece())
      }
    }

    // Start creating confetti immediately
    createConfetti()

    // Animation loop
    const animate = () => {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      let fadeProgress = 0
      
      // Calculate fade progress if fading
      if (isFading && fadeStartTimeRef.current) {
        const fadeDuration = 5000 // 5 seconds fade - much slower
        const elapsed = Date.now() - fadeStartTimeRef.current
        fadeProgress = Math.min(1, elapsed / fadeDuration)
      }
      
      // Create new confetti only if active and not fading
      if (isActive && !isFading && Math.random() > 0.7) {
        createConfetti()
      }
      
      // Update and draw confetti
      confettiRef.current = confettiRef.current.filter(piece => {
        piece.update()
        piece.draw(fadeProgress)
        
        // Remove pieces that are completely faded out or off screen
        if (fadeProgress >= 1) {
          return false // Remove all pieces when fade is complete
        }
        return !piece.isOffScreen()
      })
      
      // Continue animation if there are pieces or if we're still fading
      if (confettiRef.current.length > 0 || (isFading && fadeProgress < 1)) {
        animationRef.current = requestAnimationFrame(animate)
      } else if (fadeProgress >= 1) {
        // Reset fade state when animation is complete
        setIsFading(false)
        fadeStartTimeRef.current = null
      }
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
      confettiRef.current = []
      setIsFading(false)
      fadeStartTimeRef.current = null
    }
  }, [isActive])

  // Show canvas if active or fading
  if (!isActive && !isFading) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ top: 0, left: 0 }}
    />
  )
} 