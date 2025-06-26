"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UploadSection } from "@/components/UploadSection";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [files, setFiles] = useState({
    participants: null as File | null,
    teams: null as File | null,
    games: null as File | null,
  });

  const handleFileChange = (section: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [section]: file,
    }));
  };

  const handleUpload = (section: keyof typeof files) => {
    const file = files[section];
    if (!file) {
      toast.warn(`No file selected for ${section}`);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];

        // Get the first row (headers are already parsed into keys)
        const firstRow = rows[0] || {};

        let requiredFields: string[] = [];

        // Validate headers based on section type
        if (section === "participants") {
          requiredFields = ["participant_email", "participant_group"];
        } else if (section === "teams") {
          requiredFields = ["team_name", "member1_email", "member2_email"];
        } else if (section === "games") {
          requiredFields = [
            "member1_email",
            "member2_email",
            "member3_email",
            "member4_email",
            "game_score",
          ];
        }

        const missingFields = requiredFields.filter(
          (field) => !(field in firstRow)
        );

        if (missingFields.length > 0) {
          toast.error(
            `Invalid CSV format for ${section}. Missing fields: ${missingFields.join(
              ", "
            )}`
          );
          return;
        }

        try {
          const firebaseURL = `${process.env.NEXT_PUBLIC_FIREBASE_URL}/${section}.json`;
          const existingRes = await axios.get(firebaseURL);
          const existingData = existingRes.data || {};

          const existingKeys = new Set<string>();

          if (section === "participants") {
            Object.values(existingData).forEach((entry: any) =>
              existingKeys.add(entry.email)
            );
          } else if (section === "teams") {
            Object.values(existingData).forEach((entry: any) =>
              existingKeys.add(entry.name)
            );
          } else if (section === "games") {
            Object.values(existingData).forEach((entry: any) => {
              const key = `${entry.member_1_email}_${entry.member_2_email}_${entry.member_3_email}_${entry.member_4_email}`;
              existingKeys.add(key);
            });
          }

          // Step 3: Upload only new entries
          let skipped = 0;
          let inserted = 0;

          for (const row of rows) {
            let formattedRow: any = {};

            if (section === "participants") {
              const email = row.participant_email;
              if (existingKeys.has(email)) {
                skipped++;
                continue;
              }
              formattedRow = {
                email,
                group: row.participant_group || "",
              };
              existingKeys.add(email);
            } else if (section === "teams") {
              const name = row.team_name;
              if (existingKeys.has(name)) {
                skipped++;
                continue;
              }
              formattedRow = {
                name,
                member_1_email: row.member1_email || "",
                member_2_email: row.member2_email || "",
              };
              existingKeys.add(name);
            } else if (section === "games") {
              const key = `${row.member1_email}_${row.member2_email}_${row.member3_email}_${row.member4_email}`;
              if (existingKeys.has(key)) {
                skipped++;
                continue;
              }
              formattedRow = {
                member_1_email: row.member1_email || "",
                member_2_email: row.member2_email || "",
                member_3_email: row.member3_email || "",
                member_4_email: row.member4_email || "",
                score: parseInt(row.game_score || "0"),
              };
              existingKeys.add(key);
            }

            await axios.post(firebaseURL, formattedRow);
            inserted++;
          }

          toast.success(`${section}: ${inserted} uploaded, ${skipped} skipped`);
          setFiles((prev) => ({ ...prev, [section]: null }));
        } catch (err) {
          const errorMessage = `Failed to upload ${section}: ${
            err instanceof Error ? err.message : "Unknown error"
          }`;
          toast.error(errorMessage);
          console.error("Upload error:", err);
        }
      },
      error: (error) => {
        toast.error(`CSV parsing failed: ${error.message}`);
        console.error("Parse error:", error);
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Upload Your CSV Here</h1>
        <p className="text-muted-foreground">
          Please upload by correct format file
        </p>
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 space-y-6">
          <UploadSection
            title="Participants"
            section="participants"
            file={files.participants}
            onFileChange={(file) => handleFileChange("participants", file)}
            onUpload={() => handleUpload("participants")}
          />
          <UploadSection
            title="Teams"
            section="teams"
            file={files.teams}
            onFileChange={(file) => handleFileChange("teams", file)}
            onUpload={() => handleUpload("teams")}
          />
          <UploadSection
            title="Game"
            section="game"
            file={files.games}
            onFileChange={(file) => handleFileChange("games", file)}
            onUpload={() => handleUpload("games")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
