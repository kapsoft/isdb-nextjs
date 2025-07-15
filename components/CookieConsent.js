'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">🍪 Cookie Notice</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            We use cookies and similar technologies to enhance your experience on ISDB.io, 
            analyze site traffic, and personalize content. By clicking "Accept All", you consent 
            to our use of cookies. You can manage your preferences in our{' '}
            <a 
              href="/privacy" 
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            . For more information about how we use your data, please review our{' '}
            <a 
              href="/terms" 
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
} 