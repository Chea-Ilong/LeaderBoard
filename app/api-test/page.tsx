"use client"

import { useState } from "react"
import { testAllAPIs, testHackerRankAPI, testFirebaseAPI, validateEnvironmentVariables, APITestResult } from "@/lib/api-test"
import { COLORS } from "@/lib/constants"

export default function APITestPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    hackerrank: APITestResult | null
    firebase: APITestResult | null
    overall: boolean
  }>({
    hackerrank: null,
    firebase: null,
    overall: false
  })

  const envValidation = validateEnvironmentVariables()

  const runTests = async () => {
    setTesting(true)
    try {
      const testResults = await testAllAPIs()
      setResults(testResults)
    } catch (error) {
      console.error('Test error:', error)
    } finally {
      setTesting(false)
    }
  }

  const testIndividualAPI = async (type: 'hackerrank' | 'firebase') => {
    setTesting(true)
    try {
      if (type === 'hackerrank') {
        const result = await testHackerRankAPI(
          process.env.NEXT_PUBLIC_HACKERRANK_ROUND1_URL!,
          process.env.NEXT_PUBLIC_TOKEN!
        )
        setResults(prev => ({ ...prev, hackerrank: result }))
      } else {
        const result = await testFirebaseAPI(process.env.NEXT_PUBLIC_FIREBASE_URL!)
        setResults(prev => ({ ...prev, firebase: result }))
      }
    } catch (error) {
      console.error(`${type} test error:`, error)
    } finally {
      setTesting(false)
    }
  }

  const ResultCard = ({ title, result, onTest }: { 
    title: string
    result: APITestResult | null
    onTest: () => void 
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-feather-bold font-bold" style={{ color: COLORS.SECONDARY }}>
          {title}
        </h3>
        <button
          onClick={onTest}
          disabled={testing}
          className="px-4 py-2 rounded-lg text-white font-feather-bold font-medium disabled:opacity-50"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          {testing ? 'Testing...' : 'Test'}
        </button>
      </div>
      
      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`font-feather-bold font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.success ? '✅ Success' : '❌ Failed'}
          </div>
          <p className="text-sm mt-2 text-gray-700">{result.message}</p>
          {result.error && (
            <p className="text-sm mt-1 text-red-600">Error: {result.error}</p>
          )}
          {result.data && (
            <details className="mt-3">
              <summary className="text-sm font-medium cursor-pointer">View Details</summary>
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-feather-bold font-bold" style={{ color: COLORS.SECONDARY }}>
            API Connection Test
          </h1>
          <p className="text-gray-600 mt-2">
            Test your HackerRank and Firebase API connections before going live
          </p>
        </div>

        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-feather-bold font-bold mb-4" style={{ color: COLORS.SECONDARY }}>
            Environment Variables
          </h2>
          {envValidation.valid ? (
            <div className="text-green-700 bg-green-50 p-4 rounded-lg">
              ✅ All required environment variables are configured
            </div>
          ) : (
            <div className="text-red-700 bg-red-50 p-4 rounded-lg">
              ❌ Missing environment variables: {envValidation.missing.join(', ')}
            </div>
          )}
        </div>

        {/* Current Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-feather-bold font-bold mb-4" style={{ color: COLORS.SECONDARY }}>
            Current Configuration
          </h2>
          <div className="space-y-2 text-sm">
            <div><strong>Mock Data:</strong> {process.env.NEXT_PUBLIC_USE_MOCK_DATA || 'false'}</div>
            <div><strong>HackerRank URL:</strong> {process.env.NEXT_PUBLIC_HACKERRANK_ROUND1_URL}</div>
            <div><strong>Firebase URL:</strong> {process.env.NEXT_PUBLIC_FIREBASE_URL}</div>
            <div><strong>Token:</strong> {process.env.NEXT_PUBLIC_TOKEN ? '***configured***' : 'missing'}</div>
          </div>
        </div>

        {/* Test All Button */}
        <div className="text-center mb-8">
          <button
            onClick={runTests}
            disabled={testing || !envValidation.valid}
            className="px-8 py-3 rounded-lg text-white font-feather-bold font-bold text-lg disabled:opacity-50"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {testing ? 'Testing All APIs...' : 'Test All APIs'}
          </button>
        </div>

        {/* Individual Test Results */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ResultCard
            title="HackerRank API"
            result={results.hackerrank}
            onTest={() => testIndividualAPI('hackerrank')}
          />
          <ResultCard
            title="Firebase API"
            result={results.firebase}
            onTest={() => testIndividualAPI('firebase')}
          />
        </div>

        {/* Overall Status */}
        {(results.hackerrank || results.firebase) && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-feather-bold font-bold mb-4" style={{ color: COLORS.SECONDARY }}>
              Overall Status
            </h2>
            <div className={`p-4 rounded-lg ${results.overall ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className={`font-feather-bold font-medium ${results.overall ? 'text-green-700' : 'text-yellow-700'}`}>
                {results.overall ? '🎉 All APIs Connected Successfully!' : '⚠️ Some APIs Need Attention'}
              </div>
              <p className="text-sm mt-2">
                {results.overall 
                  ? 'Your system is ready to use real HackerRank data. You can now disable mock data in your .env file.'
                  : 'Please fix the failing API connections before switching to real data.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="font-feather-bold font-bold text-blue-900 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
            <li>Ensure all API tests pass successfully</li>
            <li>Update your .env file with correct HackerRank test IDs for different rounds</li>
            <li>Set NEXT_PUBLIC_USE_MOCK_DATA=false to switch to real data</li>
            <li>Restart your development server</li>
            <li>Test the leaderboard pages with real data</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
