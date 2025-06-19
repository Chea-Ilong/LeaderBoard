import axios from "axios"

export interface CandidateData {
  email: string
  score: number
  questions: Record<string, number>
}

export interface ApiResponse {
  data: CandidateData[]
}

// Mock data for testing
const MOCK_DATA: CandidateData[] = [
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
]

// Set this to true to use mock data, false to use real API
const USE_MOCK_DATA = false;

export async function test(): Promise<ApiResponse> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { data: MOCK_DATA }
  }

  // Real API call
  const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  })
  return response.data
}

export async function fetchLeaderboardData(): Promise<CandidateData[]> {
  try {
    const response = await test()
    return response.data
  } catch (error) {
    console.error("Error fetching leaderboard data:", error)
    throw new Error("Failed to fetch leaderboard data")
  }
}
