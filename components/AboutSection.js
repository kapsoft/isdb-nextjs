export default function AboutSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
          Reimagining Sports Data
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100">
            <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">
              AI-Powered Connections
            </h3>
            <p className="text-gray-600">
              Using cutting-edge AI technology to discover and visualize 
              relationships in sports data that traditional databases miss. 
              Our neural networks map the intricate web of connections between 
              players, teams, coaches, and historical moments, revealing the 
              hidden threads that weave together the fabric of sports history.
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl shadow-lg border border-red-100">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">
              Stat-based AI Insights
            </h3>
            <p className="text-gray-600">
              Advanced AI algorithms analyze mountains of sports statistics to reveal 
              hidden patterns, predict outcomes, and uncover the deeper stories behind 
              every play, player, and moment in sports history.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 