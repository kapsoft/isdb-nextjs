'use client'

export default function DataVisualization() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
          Explore The Graph
        </h2>
        
        {/* Placeholder for AI-powered data visualization */}
        <div className="max-w-6xl mx-auto">
          <div className="h-96 bg-white rounded-xl shadow-xl border border-gray-200 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-red-50/50" />
            <div className="relative z-10 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold text-lg">
                AI-Powered Sports Graph Visualization
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Interactive 3D network visualization coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 