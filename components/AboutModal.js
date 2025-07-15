'use client'

import { useState } from 'react'

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              INTERNET SPORTS DATABASE
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
            <p>
              ISDB.IO (The Internet Sports Database) is a website for looking up the key relationships in sports between players, teams, management, media, writers, and events - just like that movie database, but for sports.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                My name is <strong>Dean Kaplan</strong> (<a href="https://twitter.com/kapsoft" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">@kapsoft</a>). Truth be told, I'm a huge sports fan. It also happens that I'm a Software Architect, Engineer, Developer, and Product Designer. My love for sports rubbed off on my son <strong>Jake Kaplan</strong> (<a href="https://twitter.com/jakemkaplan" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">@jakemkaplan</a>) who is now the Astros beat writer for the Houston Chronicle.
              </p>
            </div>

            <p>
              During a discussion with Jake several years ago, he threw out an idea: <em>"Why is there no IMDB.com for sports?"</em>. I was hooked. I could not stop thinking about it. A simple site that one can find the chronologically sorted relationships between players, teams, management, media, writers, and events. The ultimate graph of sports data.
            </p>

            <p>
              So happily I present you a beta version of that idea born years ago.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p>
                For now the site contains only baseball data and is missing some of the data points and relationships, and the data is currently only available through the 2016 season. We aim to have the three majors soon, with the ultimate goal of having all sports at all levels.
              </p>
            </div>

            <p>
              We are interested in hearing your feedback. Please enjoy and thanks for visiting.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="mb-2">
                You can get updates on our progress by following:
              </p>
              <div className="flex justify-center">
                <a 
                  href="https://twitter.com/isdbio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  @isdbio
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 