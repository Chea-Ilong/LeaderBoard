"use client"

import axios from "axios"

export interface APITestResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

/**
 * Test HackerRank API connectivity and authentication
 */
export async function testHackerRankAPI(url: string, token: string): Promise<APITestResult> {
  try {
    console.log(`Testing HackerRank API: ${url}`)
    
    const response = await axios.get(url, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    })

    if (response.status === 200) {
      const data = response.data
      console.log('API Response:', data)
      
      return {
        success: true,
        message: `Successfully connected to HackerRank API. Found ${data.data?.length || 0} candidates.`,
        data: {
          candidateCount: data.data?.length || 0,
          sampleData: data.data?.slice(0, 2) || [], // First 2 candidates for preview
          responseStructure: Object.keys(data)
        }
      }
    } else {
      return {
        success: false,
        message: `API returned status ${response.status}`,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error: any) {
    console.error('HackerRank API Test Error:', error)
    
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: `API Error: ${error.response.status} - ${error.response.statusText}`,
        error: error.response.data?.message || error.message
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message: "Network error - Could not reach HackerRank API",
        error: "Network timeout or connection refused"
      }
    } else {
      // Other error
      return {
        success: false,
        message: "Unknown error occurred",
        error: error.message
      }
    }
  }
}

/**
 * Test Firebase connectivity
 */
export async function testFirebaseAPI(url: string): Promise<APITestResult> {
  try {
    console.log(`Testing Firebase API: ${url}`)
    
    const response = await axios.get(`${url}/participants.json`, {
      timeout: 10000
    })

    if (response.status === 200) {
      const data = response.data
      const participantCount = data ? Object.keys(data).length : 0
      
      return {
        success: true,
        message: `Successfully connected to Firebase. Found ${participantCount} participants.`,
        data: {
          participantCount,
          sampleData: data ? Object.values(data).slice(0, 2) : []
        }
      }
    } else {
      return {
        success: false,
        message: `Firebase returned status ${response.status}`,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error: any) {
    console.error('Firebase API Test Error:', error)
    
    return {
      success: false,
      message: "Could not connect to Firebase",
      error: error.message
    }
  }
}

/**
 * Test all API endpoints
 */
export async function testAllAPIs(): Promise<{
  hackerrank: APITestResult
  firebase: APITestResult
  overall: boolean
}> {
  const token = process.env.NEXT_PUBLIC_TOKEN!
  const firebaseUrl = process.env.NEXT_PUBLIC_FIREBASE_URL!
  const hackerrankUrl = process.env.NEXT_PUBLIC_HACKERRANK_ROUND1_URL!

  console.log('Testing all API connections...')
  
  const [hackerrankResult, firebaseResult] = await Promise.all([
    testHackerRankAPI(hackerrankUrl, token),
    testFirebaseAPI(firebaseUrl)
  ])

  const overall = hackerrankResult.success && firebaseResult.success

  console.log('API Test Results:', {
    hackerrank: hackerrankResult.success,
    firebase: firebaseResult.success,
    overall
  })

  return {
    hackerrank: hackerrankResult,
    firebase: firebaseResult,
    overall
  }
}

/**
 * Validate environment variables
 */
export function validateEnvironmentVariables(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_TOKEN',
    'NEXT_PUBLIC_HACKERRANK_ROUND1_URL',
    'NEXT_PUBLIC_HACKERRANK_ROUND2_URL',
    'NEXT_PUBLIC_HACKERRANK_ROUND_TEAM_URL',
    'NEXT_PUBLIC_FIREBASE_URL'
  ]

  const missing = required.filter(key => !process.env[key])

  return {
    valid: missing.length === 0,
    missing
  }
}
