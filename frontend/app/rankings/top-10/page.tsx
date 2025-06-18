export default function Top10Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Top 10 Rankings</h1>
          <p className="text-lg text-gray-600">Elite performers across all competitions</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 10 Hall of Fame</h2>
            <p className="text-gray-600 mb-6">
              Celebrating the top 10 performers who have demonstrated exceptional coding skills and problem-solving
              abilities throughout the competition.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                <strong>Recognition includes:</strong>
                <br />• Special certificates and awards
                <br />• Featured profiles and achievements
                <br />• Priority consideration for advanced programs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
