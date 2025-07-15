'use client'

import { useEffect, useRef } from 'react'

export default function Confetti({ isActive }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const confettiRef = useRef([])

  useEffect(() => {
    if (!isActive || !canvasRef.current) return

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

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        
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

    // Animation loop
    const animate = () => {
      if (!isActive) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create new confetti
      if (Math.random() > 0.7) {
        createConfetti()
      }
      
      // Update and draw confetti
      confettiRef.current = confettiRef.current.filter(piece => {
        piece.update()
        piece.draw()
        return !piece.isOffScreen()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
      confettiRef.current = []
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ top: 0, left: 0 }}
    />
  )
} 