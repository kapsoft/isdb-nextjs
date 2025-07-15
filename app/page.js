'use client'

import Hero from '../components/Hero'
import Navigation from '../components/Navigation'
import AboutSection from '../components/AboutSection'
import DataVisualization from '../components/DataVisualization'
import Logo from '../components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <Hero />
      <AboutSection />
      <div data-section="explore">
        <DataVisualization />
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto text-center text-gray-600">
          <Logo className="justify-center mb-4" />
          <p>&copy; 2025 ISDB - The Internet Sports Data Base</p>
          <p className="text-sm text-gray-500 mt-2">&copy; 2025 Kapsoft</p>
        </div>
      </footer>
    </main>
  )
} 