# HackerRank API Integration Setup Guide

## 🚀 Quick Start

Your system is now configured to use real HackerRank API data! Follow these steps to complete the setup:

### 1. Environment Configuration

Your `.env` file is already configured with the basic setup:

```bash
# Set to false to use real HackerRank API
NEXT_PUBLIC_USE_MOCK_DATA=false

# Your HackerRank API token
NEXT_PUBLIC_TOKEN=4dc24b631fa3168f575489dcd65ceb0515f30ad28198b669667f245f3bcf26e9

# Firebase for participant groups
NEXT_PUBLIC_FIREBASE_URL=https://cfcc-328b0-default-rtdb.asia-southeast1.firebasedatabase.app

# HackerRank test endpoints (update these with your actual test IDs)
NEXT_PUBLIC_HACKERRANK_ROUND1_URL=https://www.hackerrank.com/x/api/v3/tests/2154916/candidates
NEXT_PUBLIC_HACKERRANK_ROUND2_URL=https://www.hackerrank.com/x/api/v3/tests/2154916/candidates
NEXT_PUBLIC_HACKERRANK_ROUND_TEAM_URL=https://www.hackerrank.com/x/api/v3/tests/2154916/candidates
```

### 2. Configure Different Test IDs

**Important:** Currently all rounds use the same test ID (2154916). You should update these with your actual test IDs:

```bash
# Example with different test IDs:
NEXT_PUBLIC_HACKERRANK_ROUND1_URL=https://www.hackerrank.com/x/api/v3/tests/YOUR_ROUND1_TEST_ID/candidates
NEXT_PUBLIC_HACKERRANK_ROUND2_URL=https://www.hackerrank.com/x/api/v3/tests/YOUR_ROUND2_TEST_ID/candidates
NEXT_PUBLIC_HACKERRANK_ROUND_TEAM_URL=https://www.hackerrank.com/x/api/v3/tests/YOUR_TEAM_TEST_ID/candidates
```

### 3. Test API Connections

1. Visit: `http://localhost:3003/api-test`
2. Click "Test All APIs" to verify connections
3. Check that both HackerRank and Firebase APIs are working

### 4. Firebase Database Structure

Your Firebase database should have this structure:

```json
{
  "participants": {
    "participant1": {
      "email": "student1@example.com",
      "group": 1
    },
    "participant2": {
      "email": "student2@example.com", 
      "group": 2
    }
  },
  "teams": {
    "team1": {
      "member_1_email": "student1@example.com",
      "member_2_email": "student2@example.com"
    }
  },
  "games": {
    "game1": {
      "participant_email": "student1@example.com",
      "score": 15
    }
  }
}
```

### 5. HackerRank API Response Format

Your HackerRank API should return data in this format:

```json
{
  "data": [
    {
      "email": "student@example.com",
      "score": 85,
      "questions": {
        "problem_1": 25,
        "problem_2": 15,
        "problem_3": 20,
        "problem_4": 15,
        "problem_5": 10,
        "problem_6": 0
      }
    }
  ]
}
```

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check your `NEXT_PUBLIC_TOKEN` is correct
2. **404 Not Found**: Verify your test IDs in the URLs
3. **Network Error**: Check your internet connection and HackerRank API status
4. **Firebase Error**: Verify your Firebase URL and database rules

### Error Handling:

The system includes robust error handling:
- ✅ Automatic fallback to mock data if APIs fail
- ✅ Graceful handling of missing Firebase data
- ✅ Detailed error messages in console
- ✅ User-friendly error displays

### Testing Steps:

1. **Test with Mock Data First**: Set `NEXT_PUBLIC_USE_MOCK_DATA=true`
2. **Test API Connections**: Use the `/api-test` page
3. **Test Individual Rounds**: Check each round's leaderboard
4. **Test Group Rankings**: Verify group aggregation works
5. **Test Error Scenarios**: Temporarily break API URLs to test fallbacks

## 📊 Data Flow

```
HackerRank API → Individual Scores & Questions
        ↓
Firebase → Group Assignments & Team Data
        ↓
Frontend → Combined Data Display
        ↓
Leaderboards → Individual, Team, Group Rankings
```

## 🎯 Next Steps

1. ✅ Update `.env` with your actual test IDs
2. ✅ Test API connections using `/api-test`
3. ✅ Verify data displays correctly in all leaderboard views
4. ✅ Set up your Firebase database with participant groups
5. ✅ Go live with real data!

## 🔄 Switching Between Mock and Real Data

**To use Mock Data:**
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

**To use Real HackerRank Data:**
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
```

Remember to restart your development server after changing environment variables!
