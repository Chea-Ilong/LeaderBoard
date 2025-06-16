"use client";

import { test } from "@/services/api";
import { useState } from "react";

export default function OverallLeaderboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testApi = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await test();
      console.log(res.data)
      setCandidates(res.data);
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Overall Leaderboard page
      </h1>
      <p>This is where the Overall Leaderboard interface will be.</p>
      <p onClick={testApi}>Click</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {Array.isArray(candidates) && candidates.map((c, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <p><strong>Email:</strong> {c.email}</p>
          <p><strong>Score:</strong> {c.score}</p>
          {c.questions && Object.keys(c.questions).length > 0 ? (
            <div className="mt-2">
              <p className="font-semibold">Questions:</p>
              <ul className="list-disc list-inside">
                {Object.entries(c.questions).map(([questionId, score]) => (
                  <li key={questionId}>
                    Question ID: <strong>{questionId}</strong> – Score: <strong>{score}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">No questions</p>
          )}
        </div>
      ))}
    </main>
  );
}
