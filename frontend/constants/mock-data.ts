import type { LeaderboardEntry } from "@/types/leaderboard"

export const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: 1,
    rank: 1,
    fullName: "Chheang Sovanpanha",
    hackerRankId: "chheang_sovanpanha",
    group: "G1",
    scores: [10, 30, 50, 10, 10, 30],
    bonus: 3,
    totalPoints: 140,
  },
  {
    id: 2,
    rank: 2,
    fullName: "Sok Pisey",
    hackerRankId: "sok_pisey",
    group: "G2",
    scores: [10, 25, 45, 10, 8, 25],
    bonus: 2,
    totalPoints: 123,
  },
  {
    id: 3,
    rank: 3,
    fullName: "Lim Dara",
    hackerRankId: "lim_dara",
    group: "G1",
    scores: [8, 30, 40, 10, 10, 20],
    bonus: 2,
    totalPoints: 118,
  },
  {
    id: 4,
    rank: 4,
    fullName: "Chan Sophea",
    hackerRankId: "chan_sophea",
    group: "G3",
    scores: [10, 20, 50, 8, 10, 15],
    bonus: 1,
    totalPoints: 113,
  },
  {
    id: 5,
    rank: 5,
    fullName: "Pich Ratana",
    hackerRankId: "pich_ratana",
    group: "G2",
    scores: [8, 25, 35, 10, 8, 25],
    bonus: 1,
    totalPoints: 111,
  },
  {
    id: 6,
    rank: 6,
    fullName: "Meas Chenda",
    hackerRankId: "meas_chenda",
    group: "G1",
    scores: [10, 15, 40, 8, 10, 20],
    bonus: 1,
    totalPoints: 103,
  },
  {
    id: 7,
    rank: 7,
    fullName: "Keo Pisach",
    hackerRankId: "keo_pisach",
    group: "G3",
    scores: [6, 20, 35, 10, 8, 20],
    bonus: 0,
    totalPoints: 99,
  },
  {
    id: 8,
    rank: 8,
    fullName: "Noun Sreypov",
    hackerRankId: "noun_sreypov",
    group: "G2",
    scores: [8, 15, 30, 8, 10, 15],
    bonus: 1,
    totalPoints: 86,
  },
  {
    id: 9,
    rank: 9,
    fullName: "Heng Sopheak",
    hackerRankId: "heng_sopheak",
    group: "G3",
    scores: [5, 10, 25, 8, 8, 18],
    bonus: 0,
    totalPoints: 74,
  },
  {
    id: 10,
    rank: 10,
    fullName: "Ly Kimheng",
    hackerRankId: "ly_kimheng",
    group: "G1",
    scores: [6, 12, 20, 6, 10, 15],
    bonus: 0,
    totalPoints: 69,
  },
  {
    id: 11,
    rank: 11,
    fullName: "Vong Piseth",
    hackerRankId: "vong_piseth",
    group: "G2",
    scores: [4, 8, 18, 7, 6, 12],
    bonus: 0,
    totalPoints: 55,
  },
  {
    id: 12,
    rank: 12,
    fullName: "Kem Sokheng",
    hackerRankId: "kem_sokheng",
    group: "G3",
    scores: [3, 6, 15, 5, 8, 10],
    bonus: 0,
    totalPoints: 47,
  },
] as const
