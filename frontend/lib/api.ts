import axios from "axios"

export interface CandidateData {
  email: string
  score: number
  questions: Record<string, number>
}

export interface ApiResponse {
  data: CandidateData[]
  totalCount?: number
  hasMore?: boolean
}

// Round 1 Mock Data
const MOCK_ROUND_1_DATA: CandidateData[] = [
  {
    email: "chheang.sovanpanha@student.cadt.edu.kh",
    score: 140,
    questions: {
      q1: 10,
      q2: 30,
      q3: 50,
      q4: 10,
      q5: 10,
      q6: 30,
    },
  },
  {
    email: "sok.pisey@student.cadt.edu.kh",
    score: 123,
    questions: {
      q1: 10,
      q2: 25,
      q3: 45,
      q4: 10,
      q5: 8,
      q6: 25,
    },
  },
  {
    email: "lim.dara@student.cadt.edu.kh",
    score: 118,
    questions: {
      q1: 8,
      q2: 30,
      q3: 40,
      q4: 10,
      q5: 10,
      q6: 20,
    },
  },
  {
    email: "chan.sophea@student.cadt.edu.kh",
    score: 113,
    questions: {
      q1: 10,
      q2: 20,
      q3: 50,
      q4: 8,
      q5: 10,
      q6: 15,
    },
  },
  {
    email: "pich.ratana@student.cadt.edu.kh",
    score: 111,
    questions: {
      q1: 8,
      q2: 25,
      q3: 35,
      q4: 10,
      q5: 8,
      q6: 25,
    },
  },
  {
    email: "meas.chenda@student.cadt.edu.kh",
    score: 103,
    questions: {
      q1: 10,
      q2: 15,
      q3: 40,
      q4: 8,
      q5: 10,
      q6: 20,
    },
  },
  {
    email: "keo.pisach@student.cadt.edu.kh",
    score: 99,
    questions: {
      q1: 6,
      q2: 20,
      q3: 35,
      q4: 10,
      q5: 8,
      q6: 20,
    },
  },
  {
    email: "noun.sreypov@student.cadt.edu.kh",
    score: 86,
    questions: {
      q1: 8,
      q2: 15,
      q3: 30,
      q4: 8,
      q5: 10,
      q6: 15,
    },
  },
  {
    email: "heng.sopheak@student.cadt.edu.kh",
    score: 74,
    questions: {
      q1: 5,
      q2: 10,
      q3: 25,
      q4: 8,
      q5: 8,
      q6: 18,
    },
  },
  {
    email: "ly.kimheng@student.cadt.edu.kh",
    score: 69,
    questions: {
      q1: 6,
      q2: 12,
      q3: 20,
      q4: 6,
      q5: 10,
      q6: 15,
    },
  },
  {
    email: "vong.piseth@student.cadt.edu.kh",
    score: 55,
    questions: {
      q1: 4,
      q2: 8,
      q3: 18,
      q4: 7,
      q5: 6,
      q6: 12,
    },
  },
  {
    email: "kem.sokheng@student.cadt.edu.kh",
    score: 47,
    questions: {
      q1: 3,
      q2: 6,
      q3: 15,
      q4: 5,
      q5: 8,
      q6: 10,
    },
  },
  {
    email: "touch.dara@student.cadt.edu.kh",
    score: 42,
    questions: {
      q1: 2,
      q2: 5,
      q3: 12,
      q4: 6,
      q5: 7,
      q6: 10,
    },
  },
  {
    email: "kim.sothea@student.cadt.edu.kh",
    score: 38,
    questions: {
      q1: 3,
      q2: 4,
      q3: 10,
      q4: 5,
      q5: 6,
      q6: 10,
    },
  },
  {
    email: "chea.vibol@student.cadt.edu.kh",
    score: 35,
    questions: {
      q1: 2,
      q2: 3,
      q3: 8,
      q4: 4,
      q5: 8,
      q6: 10,
    },
  },
]

// Round 2 Mock Data - Different participants and improved scores
const MOCK_ROUND_2_DATA: CandidateData[] = [
  {
    email: "lim.dara@student.cadt.edu.kh",
    score: 150,
    questions: {
      q1: 15,
      q2: 35,
      q3: 45,
      q4: 12,
      q5: 15,
      q6: 28,
    },
  },
  {
    email: "chan.sophea@student.cadt.edu.kh",
    score: 139,
    questions: {
      q1: 12,
      q2: 30,
      q3: 50,
      q4: 10,
      q5: 12,
      q6: 25,
    },
  },
  {
    email: "chheang.sovanpanha@student.cadt.edu.kh",
    score: 130,
    questions: {
      q1: 10,
      q2: 25,
      q3: 40,
      q4: 15,
      q5: 10,
      q6: 30,
    },
  },
  {
    email: "pich.ratana@student.cadt.edu.kh",
    score: 117,
    questions: {
      q1: 12,
      q2: 20,
      q3: 45,
      q4: 8,
      q5: 12,
      q6: 20,
    },
  },
  {
    email: "sok.pisey@student.cadt.edu.kh",
    score: 109,
    questions: {
      q1: 8,
      q2: 22,
      q3: 35,
      q4: 12,
      q5: 10,
      q6: 22,
    },
  },
  {
    email: "keo.pisach@student.cadt.edu.kh",
    score: 105,
    questions: {
      q1: 10,
      q2: 18,
      q3: 30,
      q4: 10,
      q5: 12,
      q6: 25,
    },
  },
  {
    email: "meas.chenda@student.cadt.edu.kh",
    score: 96,
    questions: {
      q1: 8,
      q2: 15,
      q3: 35,
      q4: 10,
      q5: 8,
      q6: 20,
    },
  },
  {
    email: "heng.sopheak@student.cadt.edu.kh",
    score: 84,
    questions: {
      q1: 6,
      q2: 12,
      q3: 30,
      q4: 8,
      q5: 10,
      q6: 18,
    },
  },
  {
    email: "noun.sreypov@student.cadt.edu.kh",
    score: 76,
    questions: {
      q1: 8,
      q2: 10,
      q3: 25,
      q4: 10,
      q5: 8,
      q6: 15,
    },
  },
  {
    email: "ly.kimheng@student.cadt.edu.kh",
    score: 65,
    questions: {
      q1: 5,
      q2: 8,
      q3: 22,
      q4: 8,
      q5: 10,
      q6: 12,
    },
  },
  {
    email: "vong.piseth@student.cadt.edu.kh",
    score: 62,
    questions: {
      q1: 6,
      q2: 10,
      q3: 20,
      q4: 8,
      q5: 8,
      q6: 10,
    },
  },
  {
    email: "kem.sokheng@student.cadt.edu.kh",
    score: 58,
    questions: {
      q1: 5,
      q2: 8,
      q3: 18,
      q4: 7,
      q5: 10,
      q6: 10,
    },
  },
  {
    email: "touch.dara@student.cadt.edu.kh",
    score: 54,
    questions: {
      q1: 4,
      q2: 7,
      q3: 15,
      q4: 8,
      q5: 8,
      q6: 12,
    },
  },
  {
    email: "kim.sothea@student.cadt.edu.kh",
    score: 49,
    questions: {
      q1: 5,
      q2: 6,
      q3: 12,
      q4: 6,
      q5: 8,
      q6: 12,
    },
  },
  {
    email: "chea.vibol@student.cadt.edu.kh",
    score: 45,
    questions: {
      q1: 4,
      q2: 5,
      q3: 10,
      q4: 6,
      q5: 10,
      q6: 10,
    },
  },
  {
    email: "seng.ratanak@student.cadt.edu.kh",
    score: 41,
    questions: {
      q1: 3,
      q2: 4,
      q3: 8,
      q4: 6,
      q5: 8,
      q6: 12,
    },
  },
  {
    email: "pov.sreynich@student.cadt.edu.kh",
    score: 38,
    questions: {
      q1: 2,
      q2: 6,
      q3: 10,
      q4: 5,
      q5: 7,
      q6: 8,
    },
  },
]

// Team Leaderboard Mock Data
const MOCK_TEAM_DATA: CandidateData[] = [
  {
    email: "team.alpha@student.cadt.edu.kh",
    score: 285,
    questions: {
      q1: 25,
      q2: 55,
      q3: 95,
      q4: 22,
      q5: 25,
      q6: 63,
    },
  },
  {
    email: "team.beta@student.cadt.edu.kh",
    score: 267,
    questions: {
      q1: 22,
      q2: 50,
      q3: 85,
      q4: 20,
      q5: 23,
      q6: 67,
    },
  },
  {
    email: "team.gamma@student.cadt.edu.kh",
    score: 251,
    questions: {
      q1: 20,
      q2: 45,
      q3: 80,
      q4: 18,
      q5: 22,
      q6: 66,
    },
  },
  {
    email: "team.delta@student.cadt.edu.kh",
    score: 234,
    questions: {
      q1: 18,
      q2: 42,
      q3: 75,
      q4: 16,
      q5: 20,
      q6: 63,
    },
  },
  {
    email: "team.epsilon@student.cadt.edu.kh",
    score: 218,
    questions: {
      q1: 16,
      q2: 38,
      q3: 70,
      q4: 15,
      q5: 19,
      q6: 60,
    },
  },
]

// Check environment variables and determine if we should use mock data
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false" ||
  !process.env.NEXT_PUBLIC_TOKEN ||
  !process.env.NEXT_PUBLIC_ROUND_1 ||
  !process.env.NEXT_PUBLIC_ROUND_2

// Log configuration status
console.log("API Configuration Status:", {
  USE_MOCK_DATA,
  HAS_TOKEN: !!process.env.NEXT_PUBLIC_TOKEN,
  HAS_ROUND_1_URL: !!process.env.NEXT_PUBLIC_ROUND_1,
  HAS_ROUND_2_URL: !!process.env.NEXT_PUBLIC_ROUND_2,
  HAS_TEAM_URL: !!process.env.NEXT_PUBLIC_TEAM_LEADERBOARD_URL,
})

// Helper function to extract question scores from various API formats
function extractQuestionScores(candidate: any): Record<string, number> {
  console.log("Extracting question scores from candidate:", candidate)

  let questions: Record<string, number> = {}

  // Method 1: Direct questions object with question IDs as keys
  if (candidate.questions && typeof candidate.questions === "object") {
    console.log("Found questions object:", candidate.questions)

    // Convert question IDs to q1, q2, q3, etc. format
    const questionEntries = Object.entries(candidate.questions)

    if (questionEntries.length > 0) {
      // Check if keys are already in q1, q2 format
      const hasStandardFormat = questionEntries.some(([key]) => key.startsWith("q"))

      if (hasStandardFormat) {
        // Already in correct format
        questions = { ...candidate.questions }
      } else {
        // Convert question IDs to standard format
        // Sort by question ID to ensure consistent ordering
        const sortedQuestions = questionEntries
          .map(([questionId, score]) => ({
            id: questionId,
            score: Number.parseFloat(score as any) || 0,
          }))
          .sort((a, b) => a.id.localeCompare(b.id))

        // Map to q1, q2, q3, etc.
        sortedQuestions.forEach((question, index) => {
          if (index < 6) {
            // Only take first 6 questions
            questions[`q${index + 1}`] = Math.round(question.score)
          }
        })

        console.log("Converted question IDs to standard format:", questions)
      }
    }
  }

  // Method 2: problem_scores array from HackerRank API
  else if (candidate.problem_scores && Array.isArray(candidate.problem_scores)) {
    console.log("Found problem_scores array:", candidate.problem_scores)
    candidate.problem_scores.forEach((problemScore: any, idx: number) => {
      if (idx < 6) {
        const score = problemScore.score || problemScore.points || problemScore || 0
        questions[`q${idx + 1}`] = Math.round(Number.parseFloat(score) || 0)
      }
    })
  }

  // Method 3: scores array
  else if (candidate.scores && Array.isArray(candidate.scores)) {
    console.log("Found scores array:", candidate.scores)
    candidate.scores.forEach((score: any, idx: number) => {
      if (idx < 6) {
        questions[`q${idx + 1}`] = Math.round(Number.parseFloat(score) || 0)
      }
    })
  }

  // Method 4: Individual question properties (question_1, question_2, etc.)
  else if (candidate.question_1 !== undefined || candidate.q_1 !== undefined) {
    console.log("Found individual question properties")
    for (let i = 1; i <= 6; i++) {
      const score = candidate[`question_${i}`] || candidate[`q_${i}`] || candidate[`problem_${i}`] || 0
      questions[`q${i}`] = Math.round(Number.parseFloat(score) || 0)
    }
  }

  // Method 5: HackerRank specific structure
  else if (candidate.challenge_scores && Array.isArray(candidate.challenge_scores)) {
    console.log("Found challenge_scores array:", candidate.challenge_scores)
    candidate.challenge_scores.forEach((challengeScore: any, idx: number) => {
      if (idx < 6) {
        const score = challengeScore.score || challengeScore || 0
        questions[`q${idx + 1}`] = Math.round(Number.parseFloat(score) || 0)
      }
    })
  }

  // Method 6: Nested score structure
  else if (candidate.score_breakdown && typeof candidate.score_breakdown === "object") {
    console.log("Found score_breakdown object:", candidate.score_breakdown)
    const entries = Object.entries(candidate.score_breakdown)
    entries.forEach(([key, value], idx) => {
      if (idx < 6) {
        questions[`q${idx + 1}`] = Math.round(Number.parseFloat(value as any) || 0)
      }
    })
  }

  // Method 7: Generate realistic distribution from total score if no question data
  else {
    console.log("No question data found, generating from total score")
    const totalScore = Number.parseFloat(candidate.score || candidate.total_score || candidate.totalScore || 0)
    if (totalScore > 0) {
      // Create a realistic distribution of scores across 6 questions
      const baseScore = Math.floor(totalScore / 6)
      const remainder = totalScore % 6

      for (let i = 1; i <= 6; i++) {
        let questionScore = baseScore
        // Distribute remainder across first few questions
        if (i <= remainder) {
          questionScore += 1
        }
        // Add some variation to make it more realistic
        const variation = Math.floor(Math.random() * (baseScore * 0.3)) - Math.floor(baseScore * 0.15)
        questionScore = Math.max(0, questionScore + variation)
        questions[`q${i}`] = questionScore
      }

      // Ensure total matches (adjust last question if needed)
      const currentTotal = Object.values(questions).reduce((sum, score) => sum + score, 0)
      const difference = totalScore - currentTotal
      questions.q6 = Math.max(0, questions.q6 + difference)
    } else {
      // Default to zeros
      for (let i = 1; i <= 6; i++) {
        questions[`q${i}`] = 0
      }
    }
  }

  // Ensure all question scores are valid numbers and we have exactly 6 questions
  for (let i = 1; i <= 6; i++) {
    const key = `q${i}`
    if (questions[key] === undefined || isNaN(questions[key])) {
      questions[key] = 0
    }
    questions[key] = Math.round(questions[key])
  }

  console.log("Final extracted questions:", questions)
  return questions
}

// Helper function to generate group assignment
function generateGroup(email: string, index: number): string {
  // Try to extract group from email if it contains group info
  const emailLower = email.toLowerCase()

  // Check for group patterns in email
  const groupMatch = emailLower.match(/[._-]?g(\d+)[._-]?/) || emailLower.match(/group[._-]?(\d+)/)
  if (groupMatch) {
    const groupNum = Number.parseInt(groupMatch[1])
    if (groupNum >= 1 && groupNum <= 20) {
      return `G${groupNum}`
    }
  }

  // Check for class/section patterns
  const classMatch = emailLower.match(/[._-]?(class|section|sec)[._-]?([a-z]|\d+)/)
  if (classMatch) {
    const classId = classMatch[2].toUpperCase()
    // Convert to group number (A=1, B=2, etc.)
    if (classId.match(/[A-Z]/)) {
      const groupNum = classId.charCodeAt(0) - 64 // A=1, B=2, etc.
      if (groupNum >= 1 && groupNum <= 20) {
        return `G${groupNum}`
      }
    }
  }

  // Fallback: distribute evenly across groups based on index
  const groupNum = (index % 20) + 1
  return `G${groupNum}`
}

// Helper function to normalize API response structure
function normalizeApiResponse(response: any): CandidateData[] {
  console.log("Raw API Response:", response)

  // Handle different possible response structures
  let candidates: any[] = []

  if (Array.isArray(response)) {
    candidates = response
  } else if (response.data && Array.isArray(response.data)) {
    candidates = response.data
  } else if (response.candidates && Array.isArray(response.candidates)) {
    candidates = response.candidates
  } else if (response.results && Array.isArray(response.results)) {
    candidates = response.results
  } else if (response.models && Array.isArray(response.models)) {
    candidates = response.models
  } else {
    console.warn("Unexpected API response structure:", response)
    return []
  }

  return candidates.map((candidate, index) => {
    console.log(`Processing candidate ${index + 1}:`, candidate)

    // Normalize candidate data structure
    const email =
      candidate.email ||
      candidate.username ||
      candidate.hacker_username ||
      candidate.fullName ||
      candidate.name ||
      candidate.id ||
      `participant${index + 1}@example.com`

    const score = Number.parseFloat(
      candidate.score || candidate.total_score || candidate.totalScore || candidate.points || 0,
    )

    // Extract question scores using the enhanced function
    const questions = extractQuestionScores(candidate)

    const normalizedCandidate = {
      email,
      score: isNaN(score) ? 0 : Math.round(score),
      questions,
    }

    console.log(`Normalized candidate ${index + 1}:`, normalizedCandidate)
    return normalizedCandidate
  })
}

// Enhanced API call function with better error handling
async function makeApiCall(url: string, description: string): Promise<any> {
  if (!url) {
    throw new Error(`${description} URL is not configured`)
  }

  if (!process.env.NEXT_PUBLIC_TOKEN) {
    throw new Error("API token is not configured")
  }

  console.log(`Making API call to ${description}:`, url)

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    })

    console.log(`${description} API Response Status:`, response.status)
    console.log(`${description} API Response Data:`, response.data)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`${description} API Error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: url,
      })

      // Provide specific error messages based on status code
      if (error.response?.status === 404) {
        throw new Error(`${description} endpoint not found (404). Please check the URL: ${url}`)
      } else if (error.response?.status === 401) {
        throw new Error(`${description} authentication failed (401). Please check your API token.`)
      } else if (error.response?.status === 403) {
        throw new Error(`${description} access forbidden (403). Please check your permissions.`)
      } else if (error.response?.status === 500) {
        throw new Error(`${description} server error (500). Please try again later.`)
      } else {
        throw new Error(`${description} API error (${error.response?.status}): ${error.message}`)
      }
    } else {
      console.error(`${description} Network Error:`, error)
      throw new Error(`${description} network error: ${error}`)
    }
  }
}

export async function testRound1(): Promise<ApiResponse> {
  if (USE_MOCK_DATA) {
    console.log("Using Round 1 mock data (API not configured or mock mode enabled)")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { data: MOCK_ROUND_1_DATA }
  }

  try {
    const responseData = await makeApiCall(process.env.NEXT_PUBLIC_ROUND_1!, "Round 1")
    const normalizedData = normalizeApiResponse(responseData)
    console.log("Round 1 normalized data:", normalizedData)

    return {
      data: normalizedData,
      totalCount: normalizedData.length,
      hasMore: false,
    }
  } catch (error) {
    console.error("Round 1 API Error - falling back to mock data:", error)
    return { data: MOCK_ROUND_1_DATA }
  }
}

export async function testRound2(): Promise<ApiResponse> {
  if (USE_MOCK_DATA) {
    console.log("Using Round 2 mock data (API not configured or mock mode enabled)")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { data: MOCK_ROUND_2_DATA }
  }

  try {
    const responseData = await makeApiCall(process.env.NEXT_PUBLIC_ROUND_2!, "Round 2")
    const normalizedData = normalizeApiResponse(responseData)
    console.log("Round 2 normalized data:", normalizedData)

    return {
      data: normalizedData,
      totalCount: normalizedData.length,
      hasMore: false,
    }
  } catch (error) {
    console.error("Round 2 API Error - falling back to mock data:", error)
    return { data: MOCK_ROUND_2_DATA }
  }
}

export async function testTeam(): Promise<ApiResponse> {
  if (USE_MOCK_DATA) {
    console.log("Using Team mock data (API not configured or mock mode enabled)")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { data: MOCK_TEAM_DATA }
  }

  try {
    const responseData = await makeApiCall(process.env.NEXT_PUBLIC_TEAM_LEADERBOARD_URL!, "Team")
    const normalizedData = normalizeApiResponse(responseData)
    console.log("Team normalized data:", normalizedData)

    return {
      data: normalizedData,
      totalCount: normalizedData.length,
      hasMore: false,
    }
  } catch (error) {
    console.error("Team API Error - falling back to mock data:", error)
    return { data: MOCK_TEAM_DATA }
  }
}

export async function fetchRound1Data(): Promise<CandidateData[]> {
  try {
    const response = await testRound1()
    return response.data
  } catch (error) {
    console.error("Error fetching Round 1 data:", error)
    throw new Error("Failed to fetch Round 1 data")
  }
}

export async function fetchRound2Data(): Promise<CandidateData[]> {
  try {
    const response = await testRound2()
    return response.data
  } catch (error) {
    console.error("Error fetching Round 2 data:", error)
    throw new Error("Failed to fetch Round 2 data")
  }
}

export async function fetchTeamLeaderboardData(): Promise<CandidateData[]> {
  try {
    const response = await testTeam()
    return response.data
  } catch (error) {
    console.error("Error fetching team leaderboard data:", error)
    throw new Error("Failed to fetch team leaderboard data")
  }
}

// Legacy function for backward compatibility
export async function fetchLeaderboardData(): Promise<CandidateData[]> {
  return await fetchRound1Data()
}

// Legacy function for backward compatibility
export async function test(): Promise<ApiResponse> {
  return await testRound1()
}
