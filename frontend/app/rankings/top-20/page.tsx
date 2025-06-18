export default function Top20Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Top 20 Rankings</h1>
          <p className="text-lg text-gray-600">Outstanding achievers in the coding competition</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 20 Excellence Circle</h2>
            <p className="text-gray-600 mb-6">
              Recognizing the top 20 participants who have shown remarkable dedication, skill, and performance in the
              CADT Freshman Coding Competition.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Benefits Include:</h3>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Certificate of Excellence</li>
                  <li>• Mentorship opportunities</li>
                  <li>• Networking events access</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Future Opportunities:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Advanced coding workshops</li>
                  <li>• Industry project participation</li>
                  <li>• Scholarship considerations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
