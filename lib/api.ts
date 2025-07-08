'use client';

import axios from 'axios';

function emailToFullName(email: string): string {
    const localPart = email.split('@')[0];
    const parts = localPart.split('.');

    const capitalized = parts.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    return capitalized.reverse().join(' ');
}

type Participant = {
    email: string;
    group?: number;
};

type APIEntry = {
    email: string;
    score: number;
    questions: Record<string, number>;
};

export interface CandidateData {
    email: string;
    score: number;
    questions: Record<string, number>;
}

export interface ApiResponse {
    data: CandidateData[];
    totalCount?: number;
    hasMore?: boolean;
}

// Define the standard question order mapping with specific IDs
export const QUESTION_ID_MAPPING = {
    problem_1: 0, // Algorithm Problem 1
    problem_2: 1, // Algorithm Problem 2
    problem_3: 2, // Data Structure Problem
    problem_4: 3, // Dynamic Programming
    problem_5: 4, // Graph Theory
    problem_6: 5, // Advanced Problem
    // Legacy support for old IDs
    '2095148': 0,
    '2095248': 1,
    '2097662': 2,
    '2127626': 3,
    '2114046': 4,
    '2114049': 5,
};

// Updated question IDs for easier reference
export const QUESTION_IDS = [
    'problem_1',
    'problem_2',
    'problem_3',
    'problem_4',
    'problem_5',
    'problem_6',
];

// Question labels for display
export const QUESTION_LABELS = [
    'Algorithm 1',
    'Algorithm 2',
    'Data Structure',
    'Dynamic Programming',
    'Graph Theory',
    'Advanced Problem',
];

// Mock data that matches your exact structure - UPDATED WITH REAL PARTICIPANT NAMES
const MOCK_ROUND_1_DATA = [
    {
        fullName: 'Chheng Songheng',
        group: 1,
        questions: {
            problem_1: 32,
            problem_2: 18,
            problem_3: 25,
            problem_4: 28,
            problem_5: 12,
            problem_6: 15,
        },
        totalScore: 130,
    },
    {
        fullName: 'Hal Monytimor',
        group: 1,
        questions: {
            problem_1: 28,
            problem_2: 15,
            problem_3: 20,
            problem_4: 22,
            problem_5: 8,
            problem_6: 12,
        },
        totalScore: 105,
    },
    {
        fullName: 'Jim Seanghai',
        group: 1,
        questions: {
            problem_1: 35,
            problem_2: 20,
            problem_3: 28,
            problem_4: 32,
            problem_5: 15,
            problem_6: 18,
        },
        totalScore: 148,
    },
    {
        fullName: 'Mao Chankruesna',
        group: 1,
        questions: {
            problem_1: 25,
            problem_2: 12,
            problem_3: 18,
            problem_4: 20,
            problem_5: 9,
            problem_6: 14,
        },
        totalScore: 98,
    },
    {
        fullName: 'Meng Panhaoudom',
        group: 1,
        questions: {
            problem_1: 30,
            problem_2: 16,
            problem_3: 22,
            problem_4: 26,
            problem_5: 11,
            problem_6: 16,
        },
        totalScore: 121,
    },
    {
        fullName: 'Mong Gekleang',
        group: 1,
        questions: {
            problem_1: 22,
            problem_2: 10,
            problem_3: 15,
            problem_4: 18,
            problem_5: 6,
            problem_6: 11,
        },
        totalScore: 82,
    },
    {
        fullName: 'Oeuy Omrin',
        group: 1,
        questions: {
            problem_1: 27,
            problem_2: 14,
            problem_3: 19,
            problem_4: 23,
            problem_5: 10,
            problem_6: 13,
        },
        totalScore: 106,
    },
    {
        fullName: 'Po Chanmonyneath',
        group: 1,
        questions: {
            problem_1: 33,
            problem_2: 19,
            problem_3: 26,
            problem_4: 30,
            problem_5: 14,
            problem_6: 17,
        },
        totalScore: 139,
    },
    {
        fullName: 'Seng Dina',
        group: 1,
        questions: {
            problem_1: 24,
            problem_2: 11,
            problem_3: 16,
            problem_4: 19,
            problem_5: 7,
            problem_6: 12,
        },
        totalScore: 89,
    },
    {
        fullName: 'Tho Vicheka',
        group: 1,
        questions: {
            problem_1: 29,
            problem_2: 15,
            problem_3: 21,
            problem_4: 25,
            problem_5: 12,
            problem_6: 15,
        },
        totalScore: 117,
    },
    {
        fullName: 'Thong Nuphea',
        group: 1,
        questions: {
            problem_1: 26,
            problem_2: 13,
            problem_3: 18,
            problem_4: 21,
            problem_5: 8,
            problem_6: 13,
        },
        totalScore: 99,
    },
    {
        fullName: 'Uch Mengyean',
        group: 1,
        questions: {
            problem_1: 31,
            problem_2: 17,
            problem_3: 24,
            problem_4: 27,
            problem_5: 13,
            problem_6: 16,
        },
        totalScore: 128,
    },
    {
        fullName: 'Chann Siekfong',
        group: 1,
        questions: {
            problem_1: 23,
            problem_2: 9,
            problem_3: 14,
            problem_4: 17,
            problem_5: 5,
            problem_6: 10,
        },
        totalScore: 78,
    },
    {
        fullName: 'Chea Kuyhong',
        group: 2,
        questions: {
            problem_1: 34,
            problem_2: 21,
            problem_3: 29,
            problem_4: 35,
            problem_5: 16,
            problem_6: 20,
        },
        totalScore: 155,
    },
    {
        fullName: 'Dan Thidamorokat',
        group: 2,
        questions: {
            problem_1: 28,
            problem_2: 14,
            problem_3: 20,
            problem_4: 24,
            problem_5: 10,
            problem_6: 14,
        },
        totalScore: 110,
    },
    {
        fullName: 'Hong Bonsak',
        group: 2,
        questions: {
            problem_1: 25,
            problem_2: 12,
            problem_3: 17,
            problem_4: 21,
            problem_5: 8,
            problem_6: 12,
        },
        totalScore: 95,
    },
    {
        fullName: 'Kaing Menglay',
        group: 2,
        questions: {
            problem_1: 30,
            problem_2: 16,
            problem_3: 23,
            problem_4: 27,
            problem_5: 12,
            problem_6: 16,
        },
        totalScore: 124,
    },
    {
        fullName: 'Kong Leak Smey',
        group: 2,
        questions: {
            problem_1: 33,
            problem_2: 18,
            problem_3: 26,
            problem_4: 31,
            problem_5: 14,
            problem_6: 18,
        },
        totalScore: 140,
    },
    {
        fullName: 'Mai Sreynuth',
        group: 2,
        questions: {
            problem_1: 22,
            problem_2: 9,
            problem_3: 14,
            problem_4: 18,
            problem_5: 6,
            problem_6: 11,
        },
        totalScore: 80,
    },
    {
        fullName: 'Nhem Sun Serinyuth',
        group: 2,
        questions: {
            problem_1: 27,
            problem_2: 13,
            problem_3: 19,
            problem_4: 23,
            problem_5: 9,
            problem_6: 14,
        },
        totalScore: 105,
    },
    {
        fullName: 'Nuon Soangkeavattanak',
        group: 2,
        questions: {
            problem_1: 29,
            problem_2: 15,
            problem_3: 22,
            problem_4: 26,
            problem_5: 11,
            problem_6: 15,
        },
        totalScore: 118,
    },
    {
        fullName: 'Phea Sreynith',
        group: 2,
        questions: {
            problem_1: 31,
            problem_2: 17,
            problem_3: 24,
            problem_4: 28,
            problem_5: 13,
            problem_6: 17,
        },
        totalScore: 130,
    },
    {
        fullName: 'Say Sorayu',
        group: 2,
        questions: {
            problem_1: 26,
            problem_2: 11,
            problem_3: 16,
            problem_4: 20,
            problem_5: 7,
            problem_6: 12,
        },
        totalScore: 92,
    },
    {
        fullName: 'Sereywath Rathanak',
        group: 2,
        questions: {
            problem_1: 35,
            problem_2: 20,
            problem_3: 28,
            problem_4: 33,
            problem_5: 15,
            problem_6: 19,
        },
        totalScore: 150,
    },
    {
        fullName: 'Sin Hong',
        group: 2,
        questions: {
            problem_1: 24,
            problem_2: 10,
            problem_3: 15,
            problem_4: 19,
            problem_5: 6,
            problem_6: 11,
        },
        totalScore: 85,
    },
    {
        fullName: 'So Channolly',
        group: 2,
        questions: {
            problem_1: 32,
            problem_2: 18,
            problem_3: 25,
            problem_4: 29,
            problem_5: 13,
            problem_6: 17,
        },
        totalScore: 134,
    },
];

const MOCK_ROUND_2_DATA = [
    {
        fullName: 'Chheng Songheng',
        group: 1,
        questions: {
            problem_1: 35,
            problem_2: 20,
            problem_3: 28,
            problem_4: 32,
            problem_5: 14,
            problem_6: 18,
        },
        totalScore: 147,
    },
    {
        fullName: 'Hal Monytimor',
        group: 1,
        questions: {
            problem_1: 30,
            problem_2: 16,
            problem_3: 22,
            problem_4: 25,
            problem_5: 10,
            problem_6: 14,
        },
        totalScore: 117,
    },
    {
        fullName: 'Jim Seanghai',
        group: 1,
        questions: {
            problem_1: 38,
            problem_2: 22,
            problem_3: 31,
            problem_4: 36,
            problem_5: 17,
            problem_6: 21,
        },
        totalScore: 165,
    },
    {
        fullName: 'Mao Chankruesna',
        group: 1,
        questions: {
            problem_1: 27,
            problem_2: 13,
            problem_3: 19,
            problem_4: 22,
            problem_5: 8,
            problem_6: 15,
        },
        totalScore: 104,
    },
    {
        fullName: 'Meng Panhaoudom',
        group: 1,
        questions: {
            problem_1: 33,
            problem_2: 18,
            problem_3: 25,
            problem_4: 29,
            problem_5: 12,
            problem_6: 17,
        },
        totalScore: 134,
    },
    {
        fullName: 'Mong Gekleang',
        group: 1,
        questions: {
            problem_1: 24,
            problem_2: 11,
            problem_3: 16,
            problem_4: 19,
            problem_5: 7,
            problem_6: 12,
        },
        totalScore: 89,
    },
    {
        fullName: 'Oeuy Omrin',
        group: 1,
        questions: {
            problem_1: 29,
            problem_2: 15,
            problem_3: 21,
            problem_4: 25,
            problem_5: 11,
            problem_6: 14,
        },
        totalScore: 115,
    },
    {
        fullName: 'Po Chanmonyneath',
        group: 1,
        questions: {
            problem_1: 36,
            problem_2: 21,
            problem_3: 29,
            problem_4: 33,
            problem_5: 15,
            problem_6: 19,
        },
        totalScore: 153,
    },
    {
        fullName: 'Seng Dina',
        group: 1,
        questions: {
            problem_1: 26,
            problem_2: 12,
            problem_3: 17,
            problem_4: 21,
            problem_5: 8,
            problem_6: 13,
        },
        totalScore: 97,
    },
    {
        fullName: 'Tho Vicheka',
        group: 1,
        questions: {
            problem_1: 31,
            problem_2: 16,
            problem_3: 23,
            problem_4: 27,
            problem_5: 13,
            problem_6: 16,
        },
        totalScore: 126,
    },
    {
        fullName: 'Thong Nuphea',
        group: 1,
        questions: {
            problem_1: 28,
            problem_2: 14,
            problem_3: 20,
            problem_4: 23,
            problem_5: 9,
            problem_6: 14,
        },
        totalScore: 108,
    },
    {
        fullName: 'Uch Mengyean',
        group: 1,
        questions: {
            problem_1: 34,
            problem_2: 19,
            problem_3: 26,
            problem_4: 30,
            problem_5: 14,
            problem_6: 17,
        },
        totalScore: 140,
    },
    {
        fullName: 'Chann Siekfong',
        group: 1,
        questions: {
            problem_1: 25,
            problem_2: 10,
            problem_3: 15,
            problem_4: 18,
            problem_5: 6,
            problem_6: 11,
        },
        totalScore: 85,
    },
    {
        fullName: 'Chea Kuyhong',
        group: 2,
        questions: {
            problem_1: 37,
            problem_2: 23,
            problem_3: 32,
            problem_4: 38,
            problem_5: 18,
            problem_6: 22,
        },
        totalScore: 170,
    },
    {
        fullName: 'Dan Thidamorokat',
        group: 2,
        questions: {
            problem_1: 30,
            problem_2: 15,
            problem_3: 22,
            problem_4: 26,
            problem_5: 11,
            problem_6: 15,
        },
        totalScore: 119,
    },
];

const MOCK_TEAM_DATA = [
    {
        fullNameMember1: 'Chheng Songheng',
        fullNameMember2: 'Hal Monytimor',
        questions: {
            problem_1: 35,
            problem_2: 20,
            problem_3: 28,
            problem_4: 32,
            problem_5: 15,
            problem_6: 18,
        },
        totalScore: 148,
    },
    {
        fullNameMember1: 'Jim Seanghai',
        fullNameMember2: 'Mao Chankruesna',
        questions: {
            problem_1: 38,
            problem_2: 22,
            problem_3: 31,
            problem_4: 36,
            problem_5: 17,
            problem_6: 21,
        },
        totalScore: 165,
    },
    {
        fullNameMember1: 'Meng Panhaoudom',
        fullNameMember2: 'Mong Gekleang',
        questions: {
            problem_1: 33,
            problem_2: 18,
            problem_3: 25,
            problem_4: 29,
            problem_5: 12,
            problem_6: 17,
        },
        totalScore: 134,
    },
    {
        fullNameMember1: 'Oeuy Omrin',
        fullNameMember2: 'Po Chanmonyneath',
        questions: {
            problem_1: 36,
            problem_2: 21,
            problem_3: 29,
            problem_4: 33,
            problem_5: 15,
            problem_6: 19,
        },
        totalScore: 153,
    },
    {
        fullNameMember1: 'Seng Dina',
        fullNameMember2: 'Tho Vicheka',
        questions: {
            problem_1: 31,
            problem_2: 16,
            problem_3: 23,
            problem_4: 27,
            problem_5: 13,
            problem_6: 16,
        },
        totalScore: 126,
    },
    {
        fullNameMember1: 'Thong Nuphea',
        fullNameMember2: 'Uch Mengyean',
        questions: {
            problem_1: 34,
            problem_2: 19,
            problem_3: 26,
            problem_4: 30,
            problem_5: 14,
            problem_6: 17,
        },
        totalScore: 140,
    },
    {
        fullNameMember1: 'Chann Siekfong',
        fullNameMember2: 'Chea Kuyhong',
        questions: {
            problem_1: 37,
            problem_2: 23,
            problem_3: 32,
            problem_4: 38,
            problem_5: 18,
            problem_6: 22,
        },
        totalScore: 170,
    },
    {
        fullNameMember1: 'Dan Thidamorokat',
        fullNameMember2: 'Hong Bonsak',
        questions: {
            problem_1: 30,
            problem_2: 15,
            problem_3: 22,
            problem_4: 26,
            problem_5: 11,
            problem_6: 15,
        },
        totalScore: 119,
    },
    {
        fullNameMember1: 'Kaing Menglay',
        fullNameMember2: 'Kong Leak Smey',
        questions: {
            problem_1: 33,
            problem_2: 18,
            problem_3: 26,
            problem_4: 31,
            problem_5: 14,
            problem_6: 18,
        },
        totalScore: 140,
    },
    {
        fullNameMember1: 'Mai Sreynuth',
        fullNameMember2: 'Nhem Sun Serinyuth',
        questions: {
            problem_1: 27,
            problem_2: 13,
            problem_3: 19,
            problem_4: 23,
            problem_5: 9,
            problem_6: 14,
        },
        totalScore: 105,
    },
    {
        fullNameMember1: 'Nuon Soangkeavattanak',
        fullNameMember2: 'Phea Sreynith',
        questions: {
            problem_1: 31,
            problem_2: 17,
            problem_3: 24,
            problem_4: 28,
            problem_5: 13,
            problem_6: 17,
        },
        totalScore: 130,
    },
    {
        fullNameMember1: 'Say Sorayu',
        fullNameMember2: 'Sereywath Rathanak',
        questions: {
            problem_1: 35,
            problem_2: 20,
            problem_3: 28,
            problem_4: 33,
            problem_5: 15,
            problem_6: 19,
        },
        totalScore: 150,
    },
];

const MOCK_OVERALL_DATA = [
    {
        fullName: 'Jim Seanghai',
        group: 1,
        round1: 148,
        round2: 165,
        teamScore: 165,
        bonusScore: 42,
        totalScore: 520,
    },
    {
        fullName: 'Chea Kuyhong',
        group: 2,
        round1: 155,
        round2: 170,
        teamScore: 170,
        bonusScore: 38,
        totalScore: 533,
    },
    {
        fullName: 'Po Chanmonyneath',
        group: 1,
        round1: 139,
        round2: 153,
        teamScore: 153,
        bonusScore: 35,
        totalScore: 480,
    },
    {
        fullName: 'Sereywath Rathanak',
        group: 2,
        round1: 150,
        round2: 170,
        teamScore: 150,
        bonusScore: 32,
        totalScore: 502,
    },
    {
        fullName: 'Uch Mengyean',
        group: 1,
        round1: 128,
        round2: 140,
        teamScore: 140,
        bonusScore: 30,
        totalScore: 438,
    },
    {
        fullName: 'So Channolly',
        group: 2,
        round1: 134,
        round2: 145,
        teamScore: 134,
        bonusScore: 28,
        totalScore: 441,
    },
    {
        fullName: 'Chheng Songheng',
        group: 1,
        round1: 130,
        round2: 147,
        teamScore: 148,
        bonusScore: 26,
        totalScore: 451,
    },
    {
        fullName: 'Phea Sreynith',
        group: 2,
        round1: 130,
        round2: 140,
        teamScore: 130,
        bonusScore: 25,
        totalScore: 425,
    },
    {
        fullName: 'Meng Panhaoudom',
        group: 1,
        round1: 121,
        round2: 134,
        teamScore: 134,
        bonusScore: 24,
        totalScore: 413,
    },
    {
        fullName: 'Kaing Menglay',
        group: 2,
        round1: 124,
        round2: 130,
        teamScore: 140,
        bonusScore: 22,
        totalScore: 416,
    },
    {
        fullName: 'Kong Leak Smey',
        group: 2,
        round1: 140,
        round2: 145,
        teamScore: 140,
        bonusScore: 20,
        totalScore: 445,
    },
    {
        fullName: 'Nuon Soangkeavattanak',
        group: 2,
        round1: 118,
        round2: 125,
        teamScore: 130,
        bonusScore: 18,
        totalScore: 391,
    },
    {
        fullName: 'Tho Vicheka',
        group: 1,
        round1: 117,
        round2: 126,
        teamScore: 126,
        bonusScore: 16,
        totalScore: 385,
    },
    {
        fullName: 'Hal Monytimor',
        group: 1,
        round1: 105,
        round2: 117,
        teamScore: 148,
        bonusScore: 15,
        totalScore: 385,
    },
    {
        fullName: 'Dan Thidamorokat',
        group: 2,
        round1: 110,
        round2: 119,
        teamScore: 119,
        bonusScore: 14,
        totalScore: 362,
    },
];

// Check if we should use mock data
const USE_MOCK_DATA =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ||
    !process.env.NEXT_PUBLIC_TOKEN ||
    !process.env.NEXT_PUBLIC_HACKERRANK_ROUND1_URL ||
    !process.env.NEXT_PUBLIC_HACKERRANK_ROUND2_URL ||
    !process.env.NEXT_PUBLIC_HACKERRANK_ROUND_TEAM_URL ||
    !process.env.NEXT_PUBLIC_FIREBASE_URL;

export async function getAllParticipantIndividualRoundOne() {
    if (USE_MOCK_DATA) {
        console.log(
            'Using Round 1 mock data - generating for all participants'
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Generate complete mock data for all participants
        return await generateCompleteRound1MockData();
    }

    try {
        console.log('Fetching Round 1 data from HackerRank API...');

        // Fetch HackerRank data with timeout and error handling
        const response = await axios.get(
            process.env.NEXT_PUBLIC_HACKERRANK_ROUND1_URL!,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format from HackerRank API');
        }

        const apiData: APIEntry[] = response.data.data;
        console.log(
            `Successfully fetched ${apiData.length} candidates from HackerRank`
        );

        // Fetch Firebase participant data with error handling
        let firebaseList: Participant[] = [];
        try {
            const firebaseResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_FIREBASE_URL}/participants.json`,
                {
                    timeout: 10000,
                }
            );
            firebaseList = Object.values(firebaseResponse.data || {});
            console.log(
                `Successfully fetched ${firebaseList.length} participants from Firebase`
            );
        } catch (firebaseError) {
            console.warn(
                'Failed to fetch Firebase participant data, using default groups:',
                firebaseError
            );
            // Continue without Firebase data - participants will get default group 0
        }

        const result = apiData.map((item, index) => {
            const match = firebaseList.find((p) => p.email === item.email);

            // Debug: Log questions for each participant
            console.log(
                `Participant ${emailToFullName(item.email)} questions:`,
                item.questions
            );

            return {
                fullName: emailToFullName(item.email),
                group: match?.group || Math.floor(index % 10) + 1, // Assign to groups 1-10 if no Firebase data
                questions: item.questions || {},
                totalScore: item.score || 0,
            };
        });

        console.log(
            `Successfully processed ${result.length} Round 1 participants`
        );
        return result;
    } catch (error: any) {
        console.error('Error fetching Round 1 data:', error);

        if (error.response) {
            console.error(
                'API Response Error:',
                error.response.status,
                error.response.data
            );
            throw new Error(
                `HackerRank API Error: ${error.response.status} - ${error.response.statusText}`
            );
        } else if (error.request) {
            console.error('Network Error:', error.message);
            throw new Error(
                'Network error: Could not reach HackerRank API. Please check your internet connection.'
            );
        } else {
            console.error('Unknown Error:', error.message);
            throw new Error(`Failed to fetch Round 1 data: ${error.message}`);
        }
    }
}

export async function getAllParticipantIndividualRoundTwo() {
    if (USE_MOCK_DATA) {
        console.log(
            'Using Round 2 mock data - generating for all participants'
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Generate complete mock data for all participants
        return await generateCompleteRound2MockData();
    }

    try {
        console.log('Fetching Round 2 data from HackerRank API...');

        const response = await axios.get(
            process.env.NEXT_PUBLIC_HACKERRANK_ROUND2_URL!,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            }
        );

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format from HackerRank API');
        }

        const apiData: APIEntry[] = response.data.data;
        console.log(
            `Successfully fetched ${apiData.length} candidates from HackerRank Round 2`
        );

        // Fetch Firebase participant data with error handling
        let firebaseList: Participant[] = [];
        try {
            const firebaseResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_FIREBASE_URL}/participants.json`,
                { timeout: 10000 }
            );
            firebaseList = Object.values(firebaseResponse.data || {});
        } catch (firebaseError) {
            console.warn(
                'Failed to fetch Firebase participant data for Round 2:',
                firebaseError
            );
        }

        const result = apiData.map((item, index) => {
            const match = firebaseList.find((p) => p.email === item.email);
            return {
                fullName: emailToFullName(item.email),
                group: match?.group || Math.floor(index % 10) + 1,
                questions: item.questions || {},
                totalScore: item.score || 0,
            };
        });

        console.log(
            `Successfully processed ${result.length} Round 2 participants`
        );
        return result;
    } catch (error: any) {
        console.error('Error fetching Round 2 data:', error);

        if (error.response) {
            throw new Error(
                `HackerRank API Error: ${error.response.status} - ${error.response.statusText}`
            );
        } else if (error.request) {
            throw new Error(
                'Network error: Could not reach HackerRank API for Round 2.'
            );
        } else {
            throw new Error(`Failed to fetch Round 2 data: ${error.message}`);
        }
    }
}

export async function getAllParticipantTeamRound() {
    if (USE_MOCK_DATA) {
        console.log('Using Team mock data - generating for all participants');
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Generate complete mock data for all participants
        return await generateCompleteTeamMockData();
    }

    const response = await axios.get(
        process.env.NEXT_PUBLIC_HACKERRANK_ROUND_TEAM_URL!,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
        }
    );

    const apiData: APIEntry[] = response.data.data;

    const scoreMap = new Map<string, { score: number; questions: any }>();
    for (const item of apiData) {
        if (item.email && item.score != null) {
            scoreMap.set(item.email, {
                score: item.score,
                questions: item.questions,
            });
        }
    }

    const firebaseResponseTeam = await axios.get(
        `${process.env.NEXT_PUBLIC_FIREBASE_URL}/teams.json`
    );
    const firebaseTeamList: any[] = Object.values(
        firebaseResponseTeam.data || {}
    );

    const results: {
        fullNameMember1: string;
        fullNameMember2: string;
        questions: Record<string, number>;
        totalScore: number;
    }[] = [];

    for (const team of firebaseTeamList) {
        const m1 = team.member_1_email;
        const m2 = team.member_2_email;

        const m1Score = scoreMap.get(m1);
        const m2Score = scoreMap.get(m2);

        const finalScore = m1Score?.score ?? m2Score?.score ?? 0;
        const finalQuestions = m1Score?.questions ?? m2Score?.questions ?? {};

        results.push({
            fullNameMember1: emailToFullName(m1),
            fullNameMember2: emailToFullName(m2),
            questions: finalQuestions,
            totalScore: finalScore,
        });
    }

    return results;
}

// Centralized consistent data generator for all leaderboard pages
class ConsistentDataGenerator {
    private participants: Array<{ name: string; group: number }> = [];
    private participantProcessor: any = null;

    constructor() {
        this.initializeParticipants();
    }

    private initializeParticipants() {
        const csvData = `Name,School email,Group
Chheng Songheng,songheng.chheng@student.cadt.edu.kh,1
Hal Monytimor,monytimor.hak@student.cadt.edu.kh,1
Jim Seanghai,seanghai.jim@student.cadt.edu.kh,1
Mao Chankruesna,chankruesna.mao@student.cadt.edu.kh,1
Meng Panhaoudom,panhaoudom.meng@student.cadt.edu.kh,1
Mong Gekleang,gekleang.mong@student.cadt.edu.kh,1
Oeuy Omrin,omrin.oeuy@student.cadt.edu.kh,1
Po Chanmonyneath,chanmonyneath.po@student.cadt.edu.kh,1
Seng Dina,dina.seng@student.cadt.edu.kh,1
Tho Vicheka,vicheka.tho@student.cadt.edu.kh,1
Thong Nuphea,nuphea.thong@student.cadt.edu.kh,1
Uch Mengyean,mengyean.uch@student.cadt.edu.kh,1
Chann SiekFong,siekfong.chann@student.cadt.edu.kh,1
Chea Kuyhong,kuyhong.chea@student.cadt.edu.kh,2
Dan Thidamorokat,thidamorokat.dan@student.cadt.edu.kh,2
Hong Bonsak,bonsak.hong@student.cadt.edu.kh,2
Kaing Menglay,menglay.kaing@student.cadt.edu.kh,2
Kong Leak Smey,leaksmey.kong@student.cadt.edu.kh,2
Mai Sreynuth,sreynuth.mai@student.cadt.edu.kh ,2
Nhem Sun Serinyuth,sunserinyuth.nhem@student.cadt.edu.kh,2
Nuon soangkeavattanak ,soangkeavattanak.nuon@student.cadt.edu.kh,2
Phea Sreynith,sreynith.phea@student.cadt.edu.kh,2
Say sorayu,sorayu.say@student.cadt.edu.kh,2
Sereywath Rathanak,rathanak.sereywath@student.cadt.edu.kh,2
Sin Hong,hong.sin@student.cadt.edu.kh,2
So Channolly,channolly.so@student.cadt.edu.kh,2
Chhen Chanthoeurn,chanthoeurn.chhen@student.cadt.edu.kh,3
Deng Monyoudom,monyoudom.deng@student.cadt.edu.kh,3
Horn Koemhoing,koemhoing.horn@student.cadt.edu.kh,3
In Uddam Darren,uddamdarren.in@student.cadt.edu.kh,3
Lor Sophy,sophy.lor@student.cadt.edu.kh,3
Nov Sokpanha,sokpanha.nov@student.cadt.edu.kh,3
Sok Chingchheav,chingchheav.sok@student.cadt.edu.kh,3
Sokheng Mengly,mengly.sokheng@student.cadt.edu.kh,3
Svay Monirath,monirath.svay@student.cadt.edu.kh,3
Ly Yeak Khai,yeakkhai.ly@student.cadt.edu.kh,3
Roeurn Sokviseth,sokviseth.roeurn@student.cadt.edu.kh,3
Born Chansothearith,chansothearith.born@student.cadt.edu.kh,4
Chan Veasna,veasna.chan@student.cadt.edu.kh,4
Chao Vanchhoeurng,vanchhoeurng.chao@student.cadt.edu.kh,4
Chay Senghap,senghap.chay@Student.cadt.edu.kh,4
Loun Rotha,rotha.loun@student.cadt.edu.kh,4
Ly Srongchhay,Srongchhay.ly@student.cadt.edu.kh,4
Phally Sovanratana,sovanratana.phally@student.cadt.edu.kh,4
Phoeurn Rozariya,Rozariya.phoeurn@student.cadt.edu.kh,4
Run Chandara,chandara.run@student.cadt.edu.kh,4
Rin Layheang,layheang.rin@student.cadt.edu.kh,4
Ron Sovanrith,sovanrith.ron@student.cadt.edu.kh,4
Roth Sorayuth,sorayuth.roth@student.cadt.edu.kh,4
Vean Sovanvirak,sovanvirak.vean@student.cadt.edu.kh,4
Yann Sokmeng,Sokmeng.yann@student.cadt.edu.kh,4
Yoeung Seyha,seyha.yoeung@student.cadt.edu.kh,4
Yun Eychhean,eychhean.yun@student.cadt.edu.kh,4
Bun Hunheng,hunheng.bun@student.cadt.edu.kh,5
Chey Naryvety,naryvety.chey@student.cadt.edu.kh,5
Engtouch Sokhy,sokhy.engtouch@student.cadt.edu.kh,5
Im Oudompanha,oudompanha.im@student.cadt.edu.kh,5
Kong Sovanmonisokhabotr,sovanmonisokhabotr.Kong@Student.cadt.edu.kh,5
Ngov Lysovath,lysovath.ngov@student.cadt.edu.kh,5
Nob Johnson,johnson.nob@student.cadt.edu.kh,5
Oeng Chheangsing,chheangsing.oeng@student.cadt.edu.kh,5
Ou Tharatheb,tharatheb.ou@student.cadt.edu.kh,5
Rith Vichet,vichet.rith@student.cadt.edu.kh,5
Se nita,nita.se@student.cadt.edu.kh,5
Seng Chinging,Chinging.seng@student.cadt.edu.kh,5
Sothea Rithy,rithy.sothea@student.cadt.edu.kh,5
Thang Saoly,saoly.thang@student.cadt.edu.kh,5
Thunny Maridenn,maridenn.thunny@student.cadt.edu.kh,5
Yam Sosereiwat,sosereiwat.yam@student.cadt.edu.kh,5
Chan Sokseyha,sokseyha.chan@student.cadt.edu.kh,5
Bun Sarim,sarim.bun@student.cadt.edu.kh,6
Hai Socheat,socheat.hai@student.cadt.edu.kh,6
Keo Sokchea,Sokchea.keo@student.cadt.edu.kh,6
Khon Panha,Panha.khon@student.cadt.edu.kh,6
Leu Leaphour,leaphour.leu@student.cadt.edu.kh,6
Mao Nary,nary.mao@student.cadt.edu.kh,6
Mony Kosalthida,kosalthida.mony@student.cadt.edu.kh,6
Nang Sreynich,sreynich.nang@student.cadt.edu.kh,6
Nou Reaksmey,reaksmey.nou@student.cadt.edu.kh,6
Nuy Bunhou,bunhou.nuy@student.cadt.edu.kh,6
Oun Vireak,vireak.oun@student.cadt.edu.kh,6
Prak Viriyakbott,viriyakbott.prak@student.cadt.edu.kh,6
Samath Monicapagnakol,monicapagnakol.samath@student.cadt.edu.kh,6
Seng Mengseang,mengseang.seng@student.cadt.edu.kh,6
Sophan Sotheany,sotheany.sophan@student.cadt.edu.kh,6
Thal Sotharith,sotharith.thal@student.cadt.edu.kh,6
Y lyheng,lyheng.y@student.cadt.edu.kh,6
Yang Vitou,vitou.yang@student.cadt.edu.kh,6
Yeat David,david.yeat@student.cadt.edu.kh,6
Khy Chhoungech,chhoungech.khy@student.cadt.edu.kh,7
Chan Sopheak,sopheak.chan@student.cadt.edu.kh,7
Chhem Bunnak,bunnak.chhem@student.cadt.edu.kh,7
Eung David,davideung@student.cadt.edu.kh,7
Heng Sreyka,sreyka.heng@student.cadt.edu.kh,7
Kong Sophea,sophea.kong@student.cadt.edu.kh,7
Kue Chanchessika,chanchessika.kue@student.cadt.edu.kh,7
Long Sotheara,sotheara.long@student.cadt.edu.kh,7
Ly Sophearak,sophearak.ly@student.cadt.edu.kh,7
Nget Sokunkanha,sokunkanha.nget@student.cadt.edu.kh,7
Oeng Vengku,vengku.oeng@student.cadt.edu.kh,7
Poch Seavmeng,seavmeng.poch@student.cadt.edu.kh,7
Rithy Piseth,piseth.rithy@student.cadt.edu.kh,7
Samnang Rithybot,rithybot.samnang@student.cadt.edu.kh,7
Sao Sochealika,sochealika.sao@student.cadt.edu.kh,7
Seng Namkea,namkea.seng@student.cadt.edu.kh,7
Teav Norint,norint.teav@student.cadt.edu.kh,7
Veng Devit,devit.veng@student.cadt.edu.kh,7
Vorng Viseth,viseth.vorng@student.cadt.edu.kh,7
Yorn Pheaktra,pheaktra.yorn@student.cadt.edu.kh,7
Chap Chanliya,chanliya.chap@student.cadt.edu.kh,8
Chean Sovanreach,sovanreach.chean@student.cadt.edu.kh,8
Chhoun Vannaksokpanha,vannaksokpanha.chhoun@student.cadt.edu.kh,8
Hak Kimhour,kimhour.hak@student.cadt.edu.kh ,8
Hem Eamsocheat,eamsocheat.hem@student.cadt.edu.kh,8
Him Zhiangtong,zhiangtong.him@student.cadt.edu.kh,8
Hong Sindy,sindy.hong@student.cadt.edu.kh,8
Horn Sovisal,sovisal.horn@student.cadt.edu.kh,8
Keo Kimhong,kimhong.keo@student.cadt.edu.kh,8
Khy Gio,gio.khy@student.cadt.edu.kh,8
Kuyseng Marakat,marakat.kuyseng@student.cadt.edu.kh,8
Ngoun Sovichet,sovichet.ngoun@student.cadt.edu.kh,8
Samolty Lundy,lundy.samolty@student.cadt.edu.kh,8
Sok Yongyi,Yongyi.sok@student.cadt.edu.kh,8
Suon Vannsakal,vannsakal.suon@student.cadt.edu.kh ,8
Taing Sothyvan,sothyvan.taing@student.cadt.edu.kh,8
Tet Davann,davann.tet@student.cadt.edu.kh,8
Thai Chansothymon,chansothymon.thai@student.cadt.edu.kh,8
You Chehnintchesda,chehnintchesda.you@student.cadt.edu.kh,8
Chhit Tola,tola.chhit@student.cadt.edu.kh,9
Eav Sophal Veha,sophalveha.eav@student.cadt.edu.kh,9
Eng Vathana,vathana.eng@student.cadt.edu.kh,9
Iv Meytan,meytan.iv@student.cadt.edu.kh,9
Khim Sakpiseth,sakpiseth.khim@student.cadt.edu.kh,9
Kili Savlong,savlong.kili@student.cadt.edu.kh,9
Kim Sambath,sambath.kim@student.cadt.edu.kh,9
Leang Sivming,sivming.leang@student.cadt.edu.kh,9
Ny Chamnan,chamnan.ny@student.cadt.edu.kh,9
Rath Phavy,phavy.rath@student.cadt.edu.kh,9
Reuk Sokuntheary,sokuntheary.reuk@student.cadt.edu.kh,9
Roth Thavrak,thavrak.roth@student.cadt.edu.kh,9
Ry Sophana,ry.sopanha@student.cadt.edu.kh,9
San Chanthai,chanthai.san@student.cadt.edu.kh,9
Seng Chansreybopha,chansreybopha.seng@student.cadt.edu.kh,9
Song Saknora,saknora.song@student.cadt.edu.kh,9
Hong Limhak,limhak.hong@student.cadt.edu.kh,9
Chan Archvathanak,archvathanak.chan@student.cadt.edu.kh,10
Channy Sreyoun,sreyoun.channy@student.cadt.edu.kh,10
Chom Devid,devid.chom@student.cadt.edu.kh,10
Doung Seyhakbondeth,seyhakbondeth.doung@student.cadt.edu.kh,10
Hon Niza,niza.hon@student.cadt.edu.kh,10
Kong Sothearith,sothearith.kong@student.cadt.edu.kh,10
Por Menghong,menghong.por@student.cadt.edu.kh,10
Sarun Yohana,yohana.sarun@student.cadt.edu.kh,10
Seu Puthpissoth,puthpissoth.seu@student.cadt.edu.kh,10
Thoeun Yanit,yanit.thoeun@student.cadt.edu.kh,10
Yan Sovanpisoth,sovanpisoth.yan@student.cadt.edu.kh,10`;

        // Parse CSV data
        const lines = csvData.trim().split('\n');
        lines.shift(); // Remove header

        this.participants = lines.map((line) => {
            const [name, email, group] = line.split(',');
            return {
                name: name.trim(),
                group: parseInt(group.trim()),
            };
        });
    }

    private async getParticipantProcessor() {
        if (!this.participantProcessor) {
            const { participantProcessor } = await import(
                './participant-data-processor'
            );
            this.participantProcessor = participantProcessor;
        }
        return this.participantProcessor;
    }

    // Seeded random number generator for consistent results
    private seededRandom(seed: number): () => number {
        let currentSeed = seed;
        return () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };
    }

    // Hash function for consistent seed generation
    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Generate consistent scores for a participant across all rounds
    async generateParticipantScores(participantName: string) {
        const processor = await this.getParticipantProcessor();

        // Generate consistent round scores using the existing function
        const round1Questions =
            processor.generateRealisticCompetitiveProgrammingScores(
                participantName,
                1,
                'medium'
            );
        const round2Questions =
            processor.generateRealisticCompetitiveProgrammingScores(
                participantName,
                2,
                'medium'
            );

        // Calculate round totals
        const round1Score = Object.values(round1Questions).reduce(
            (sum: number, score: unknown) => sum + ((score as number) || 0),
            0
        );
        const round2Score = Object.values(round2Questions).reduce(
            (sum: number, score: unknown) => sum + ((score as number) || 0),
            0
        );

        // Generate consistent team and bonus scores using seeded randomization
        const teamSeed = this.hashString(participantName + '_team');
        const bonusSeed = this.hashString(participantName + '_bonus');

        const teamRng = this.seededRandom(teamSeed);
        const bonusRng = this.seededRandom(bonusSeed);

        const teamScore = Math.floor(
            (round1Score + round2Score) * 0.6 + teamRng() * 80
        );
        const bonusScore = Math.floor(bonusRng() * 51);

        return {
            round1: {
                questions: round1Questions,
                totalScore: round1Score,
            },
            round2: {
                questions: round2Questions,
                totalScore: round2Score,
            },
            teamScore,
            bonusScore,
            overallTotal: round1Score + round2Score + teamScore + bonusScore,
        };
    }

    // Generate all participants data
    async generateAllParticipantsData() {
        const allData = [];

        for (const participant of this.participants) {
            const scores = await this.generateParticipantScores(
                participant.name
            );
            allData.push({
                participant,
                scores,
            });
        }

        return allData;
    }

    getParticipants() {
        return this.participants;
    }

    // Generate team data with realistic pairings
    async generateTeamData() {
        const allData = await this.generateAllParticipantsData();
        const teams = [];

        // Create teams by pairing participants (can be from different groups)
        // Use a consistent pairing algorithm based on participant names
        const sortedParticipants = [...allData].sort((a, b) =>
            a.participant.name.localeCompare(b.participant.name)
        );

        for (let i = 0; i < sortedParticipants.length - 1; i += 2) {
            const member1Data = sortedParticipants[i];
            const member2Data = sortedParticipants[i + 1];

            if (member1Data && member2Data) {
                // Calculate team score as the better score for each problem
                const teamQuestions: { [key: string]: number } = {};

                // Get all problem keys from both members
                const allProblemKeys = new Set([
                    ...Object.keys(member1Data.scores.round1.questions),
                    ...Object.keys(member2Data.scores.round1.questions),
                ]);

                // For each problem, take the better score
                allProblemKeys.forEach((problemKey) => {
                    const score1 =
                        member1Data.scores.round1.questions[problemKey] || 0;
                    const score2 =
                        member2Data.scores.round1.questions[problemKey] || 0;
                    teamQuestions[problemKey] = Math.max(score1, score2);
                });

                const totalScore = Object.values(teamQuestions).reduce(
                    (sum: number, score: number) => sum + score,
                    0
                );

                teams.push({
                    fullNameMember1: member1Data.participant.name,
                    fullNameMember2: member2Data.participant.name,
                    questions: teamQuestions,
                    totalScore,
                });
            }
        }

        // Sort by total score descending
        return teams.sort((a, b) => b.totalScore - a.totalScore);
    }

    // Verification system to ensure data consistency across all pages
    async verifyDataConsistency() {
        console.log('🔍 Starting data consistency verification...');

        try {
            const allData = await this.generateAllParticipantsData();
            const round1Data = await this.generateAllParticipantsData();
            const round2Data = await this.generateAllParticipantsData();
            const overallData = allData.map(({ participant, scores }) => ({
                fullName: participant.name,
                group: participant.group,
                round1: scores.round1.totalScore,
                round2: scores.round2.totalScore,
                teamScore: scores.teamScore,
                bonusScore: scores.bonusScore,
                totalScore: scores.overallTotal,
            }));

            const errors = [];
            let participantCount = 0;
            let consistentParticipants = 0;

            // Verify each participant's data consistency
            for (const { participant, scores } of allData) {
                participantCount++;
                let participantErrors = [];

                // Find participant in round data
                const round1Participant = round1Data.find(
                    (p) => p.participant.name === participant.name
                );
                const round2Participant = round2Data.find(
                    (p) => p.participant.name === participant.name
                );
                const overallParticipant = overallData.find(
                    (p) => p.fullName === participant.name
                );

                if (
                    !round1Participant ||
                    !round2Participant ||
                    !overallParticipant
                ) {
                    participantErrors.push(
                        `Missing data for ${participant.name}`
                    );
                    continue;
                }

                // Verify Round 1 consistency
                if (
                    round1Participant.scores.round1.totalScore !==
                    scores.round1.totalScore
                ) {
                    participantErrors.push(
                        `Round 1 score mismatch for ${participant.name}: ` +
                            `${round1Participant.scores.round1.totalScore} vs ${scores.round1.totalScore}`
                    );
                }

                // Verify Round 2 consistency
                if (
                    round2Participant.scores.round2.totalScore !==
                    scores.round2.totalScore
                ) {
                    participantErrors.push(
                        `Round 2 score mismatch for ${participant.name}: ` +
                            `${round2Participant.scores.round2.totalScore} vs ${scores.round2.totalScore}`
                    );
                }

                // Verify Overall score calculation
                const expectedTotal =
                    scores.round1.totalScore +
                    scores.round2.totalScore +
                    scores.teamScore +
                    scores.bonusScore;
                if (overallParticipant.totalScore !== expectedTotal) {
                    participantErrors.push(
                        `Overall score calculation error for ${participant.name}: ` +
                            `${overallParticipant.totalScore} vs expected ${expectedTotal} ` +
                            `(R1:${scores.round1.totalScore} + R2:${scores.round2.totalScore} + Team:${scores.teamScore} + Bonus:${scores.bonusScore})`
                    );
                }

                // Verify individual question scores consistency
                Object.keys(scores.round1.questions).forEach((problemKey) => {
                    if (
                        round1Participant.scores.round1.questions[
                            problemKey
                        ] !== scores.round1.questions[problemKey]
                    ) {
                        participantErrors.push(
                            `Round 1 ${problemKey} score mismatch for ${participant.name}: ` +
                                `${round1Participant.scores.round1.questions[problemKey]} vs ${scores.round1.questions[problemKey]}`
                        );
                    }
                });

                if (participantErrors.length === 0) {
                    consistentParticipants++;
                } else {
                    errors.push(...participantErrors);
                }
            }

            // Generate verification report
            const report = {
                totalParticipants: participantCount,
                consistentParticipants,
                inconsistentParticipants:
                    participantCount - consistentParticipants,
                consistencyRate: (
                    (consistentParticipants / participantCount) *
                    100
                ).toFixed(2),
                errors: errors.slice(0, 10), // Show first 10 errors
                totalErrors: errors.length,
            };

            console.log('📊 Data Consistency Verification Report:');
            console.log(`✅ Total Participants: ${report.totalParticipants}`);
            console.log(
                `✅ Consistent Participants: ${report.consistentParticipants}`
            );
            console.log(
                `❌ Inconsistent Participants: ${report.inconsistentParticipants}`
            );
            console.log(`📈 Consistency Rate: ${report.consistencyRate}%`);

            if (report.errors.length > 0) {
                console.log(
                    `⚠️  First ${Math.min(10, report.totalErrors)} errors:`
                );
                report.errors.forEach((error) => console.log(`   - ${error}`));
                if (report.totalErrors > 10) {
                    console.log(
                        `   ... and ${report.totalErrors - 10} more errors`
                    );
                }
            } else {
                console.log('🎉 All data is consistent across pages!');
            }

            return report;
        } catch (error) {
            console.error(
                '❌ Error during data consistency verification:',
                error
            );
            return {
                error: (error as Error).message || 'Unknown error',
                totalParticipants: 0,
                consistentParticipants: 0,
                inconsistentParticipants: 0,
                consistencyRate: '0.00',
                errors: [],
                totalErrors: 0,
            };
        }
    }
}

// Create global instance
const consistentDataGenerator = new ConsistentDataGenerator();

// Generate complete overall mock data for all participants
async function generateCompleteOverallMockData() {
    try {
        const allData =
            await consistentDataGenerator.generateAllParticipantsData();

        // Transform to overall leaderboard format
        const overallData = allData.map(({ participant, scores }) => ({
            fullName: participant.name,
            group: participant.group,
            round1: scores.round1.totalScore,
            round2: scores.round2.totalScore,
            teamScore: scores.teamScore,
            bonusScore: scores.bonusScore,
            totalScore: scores.overallTotal,
        }));

        // Sort by total score descending
        return overallData.sort((a, b) => b.totalScore - a.totalScore);
    } catch (error) {
        console.error('Error generating complete overall mock data:', error);
        // Fallback to the original hardcoded data
        return MOCK_OVERALL_DATA;
    }
}

// Generate consistent Round 1 data for all participants
async function generateCompleteRound1MockData() {
    try {
        const allData =
            await consistentDataGenerator.generateAllParticipantsData();

        // Transform to Round 1 leaderboard format
        const round1Data = allData.map(({ participant, scores }) => ({
            fullName: participant.name,
            group: participant.group,
            questions: scores.round1.questions,
            totalScore: scores.round1.totalScore,
        }));

        // Sort by total score descending
        return round1Data.sort((a, b) => b.totalScore - a.totalScore);
    } catch (error) {
        console.error('Error generating complete Round 1 mock data:', error);
        // Fallback to the original hardcoded data
        return MOCK_ROUND_1_DATA;
    }
}

// Generate consistent Round 2 data for all participants
async function generateCompleteRound2MockData() {
    try {
        const allData =
            await consistentDataGenerator.generateAllParticipantsData();

        // Transform to Round 2 leaderboard format
        const round2Data = allData.map(({ participant, scores }) => ({
            fullName: participant.name,
            group: participant.group,
            questions: scores.round2.questions,
            totalScore: scores.round2.totalScore,
        }));

        // Sort by total score descending
        return round2Data.sort((a, b) => b.totalScore - a.totalScore);
    } catch (error) {
        console.error('Error generating complete Round 2 mock data:', error);
        // Fallback to the original hardcoded data
        return MOCK_ROUND_2_DATA;
    }
}

// Generate consistent Team data for all participants
async function generateCompleteTeamMockData() {
    try {
        return await consistentDataGenerator.generateTeamData();
    } catch (error) {
        console.error('Error generating complete Team mock data:', error);
        // Fallback to the original hardcoded data
        return MOCK_TEAM_DATA;
    }
}

export async function getAllParticipantOverall() {
    if (USE_MOCK_DATA) {
        console.log(
            'Using Overall mock data - generating for all participants'
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Generate complete mock data for all participants from CSV
        return await generateCompleteOverallMockData();
    }

    const [round1, round2, teamRound, participantsRes, gamesRes] =
        await Promise.all([
            getAllParticipantIndividualRoundOne(),
            getAllParticipantIndividualRoundTwo(),
            getAllParticipantTeamRound(),
            axios.get(
                `${process.env.NEXT_PUBLIC_FIREBASE_URL}/participants.json`
            ),
            axios.get(`${process.env.NEXT_PUBLIC_FIREBASE_URL}/games.json`),
        ]);

    const participants: Participant[] = Object.values(
        participantsRes.data || {}
    );
    const games: any[] = Object.values(gamesRes.data || {});

    // Map round scores by full name
    const round1Map = new Map<string, number>();
    round1.forEach((p) => round1Map.set(p.fullName, p.totalScore));

    const round2Map = new Map<string, number>();
    round2.forEach((p) => round2Map.set(p.fullName, p.totalScore));

    // Map team scores by full name
    const teamScoreMap = new Map<string, number>();
    teamRound.forEach((team) => {
        teamScoreMap.set(team.fullNameMember1, team.totalScore);
        teamScoreMap.set(team.fullNameMember2, team.totalScore);
    });

    // Map bonus score from games by email
    const bonusScoreMap = new Map<string, number>();
    for (const game of games) {
        const members = [
            game.member_1_email,
            game.member_2_email,
            game.member_3_email,
            game.member_4_email,
        ];
        for (const email of members) {
            if (email) {
                bonusScoreMap.set(email, game.score || 0);
            }
        }
    }

    const results = participants.map((p) => {
        const email = p.email;
        const fullName = emailToFullName(email);
        const group = p.group || 0;

        const round1Score = round1Map.get(fullName) || 0;
        const round2Score = round2Map.get(fullName) || 0;
        const teamScore = teamScoreMap.get(fullName) || 0;
        const bonusScore = bonusScoreMap.get(email) || 0;

        const totalScore = round1Score + round2Score + teamScore + bonusScore;

        return {
            fullName,
            group,
            round1: round1Score,
            round2: round2Score,
            teamScore,
            bonusScore,
            totalScore,
        };
    });

    return results;
}

// API adapter functions for backward compatibility
export async function fetchRound1Data(): Promise<CandidateData[]> {
    try {
        const data = await getAllParticipantIndividualRoundOne();
        return data.map((item) => ({
            email: item.fullName,
            score: item.totalScore,
            questions: item.questions,
        }));
    } catch (error) {
        console.error('Error fetching Round 1 data:', error);
        throw new Error('Failed to fetch Round 1 data');
    }
}

export async function fetchRound2Data(): Promise<CandidateData[]> {
    try {
        const data = await getAllParticipantIndividualRoundTwo();
        return data.map((item) => ({
            email: item.fullName,
            score: item.totalScore,
            questions: item.questions,
        }));
    } catch (error) {
        console.error('Error fetching Round 2 data:', error);
        throw new Error('Failed to fetch Round 2 data');
    }
}

// Export verification function for testing
export async function verifyDataConsistency() {
    return await consistentDataGenerator.verifyDataConsistency();
}

export async function fetchTeamLeaderboardData(): Promise<CandidateData[]> {
    try {
        const data = await getAllParticipantTeamRound();
        return data.map((team) => ({
            email: `${team.fullNameMember1} & ${team.fullNameMember2}`,
            score: team.totalScore,
            questions: team.questions,
        }));
    } catch (error) {
        console.error('Error fetching team leaderboard data:', error);
        throw new Error('Failed to fetch team leaderboard data');
    }
}

// Legacy functions for backward compatibility
export async function fetchLeaderboardData(): Promise<CandidateData[]> {
    return await fetchRound1Data();
}

export async function testRound1(): Promise<ApiResponse> {
    const data = await fetchRound1Data();
    return { data, totalCount: data.length, hasMore: false };
}

export async function testRound2(): Promise<ApiResponse> {
    const data = await fetchRound2Data();
    return { data, totalCount: data.length, hasMore: false };
}

export async function testTeam(): Promise<ApiResponse> {
    const data = await fetchTeamLeaderboardData();
    return { data, totalCount: data.length, hasMore: false };
}

export async function test(): Promise<ApiResponse> {
    return await testRound1();
}
