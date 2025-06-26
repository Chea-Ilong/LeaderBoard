"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadSectionProps {
  title: string
  section: string
  file: File | null
  onFileChange: (file: File | null) => void
  onUpload: () => void
}

export function UploadSection({ title, section, file, onFileChange, onUpload }: UploadSectionProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={`${section}-file`} className="text-base font-medium">
        {title}
      </Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id={`${section}-file`}
            type="file"
            accept=".csv"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
          />
        </div>
        <Button onClick={onUpload} disabled={!file} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6">
          Upload
        </Button>
      </div>
    </div>
  )
}
