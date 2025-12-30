"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { PrimaryButton } from "@workspace/ui/components/primary-button"
import { IconUpload, IconFile, IconX, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: "pending" | "uploading" | "complete" | "error"
  error?: string
}

interface DocumentUploadZoneProps {
  onUpload?: (files: File[]) => void | Promise<void>
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
  className?: string
}

const DEFAULT_ACCEPT = ".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
const DEFAULT_MAX_SIZE = 50 * 1024 * 1024 // 50MB
const DEFAULT_MAX_FILES = 10

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export function DocumentUploadZone({
  onUpload,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  className,
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`
      }
      const ext = "." + file.name.split(".").pop()?.toLowerCase()
      if (!accept.split(",").some((a) => a.trim().toLowerCase() === ext)) {
        return `File type ${ext} not supported`
      }
      return null
    },
    [accept, maxSize]
  )

  const handleFiles = useCallback(
    async (inputFiles: FileList | File[]) => {
      const fileArray = Array.from(inputFiles).slice(0, maxFiles - files.length)

      const newFiles: UploadedFile[] = fileArray.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "pending" as const,
        error: validateFile(file) || undefined,
      }))

      // Add valid files to state
      const validFiles = newFiles.filter((f) => !f.error)
      const invalidFiles = newFiles.filter((f) => f.error)

      setFiles((prev) => [...prev, ...newFiles])

      if (validFiles.length > 0 && onUpload) {
        setIsUploading(true)

        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            validFiles.some((vf) => vf.id === f.id)
              ? { ...f, status: "uploading" as const, progress: 0 }
              : f
          )
        )

        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise((r) => setTimeout(r, 200))
            setFiles((prev) =>
              prev.map((f) =>
                validFiles.some((vf) => vf.id === f.id) && f.status === "uploading"
                  ? { ...f, progress }
                  : f
              )
            )
          }

          // TODO: Replace with actual upload
          await onUpload(validFiles.map((f) => f.file))

          // Mark as complete
          setFiles((prev) =>
            prev.map((f) =>
              validFiles.some((vf) => vf.id === f.id)
                ? { ...f, status: "complete" as const, progress: 100 }
                : f
            )
          )
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) =>
              validFiles.some((vf) => vf.id === f.id)
                ? { ...f, status: "error" as const, error: "Upload failed" }
                : f
            )
          )
        } finally {
          setIsUploading(false)
        }
      }
    },
    [files.length, maxFiles, onUpload, validateFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
        e.target.value = "" // Reset input
      }
    },
    [handleFiles]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== "complete"))
  }, [])

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-dashed transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/50 hover:border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div
            className={cn(
              "p-3 rounded-full mb-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <IconUpload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <h3 className="font-medium mb-1">
            {isDragging ? "Drop files here" : "Drop documents here or click to upload"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, XLSX, and image files. Max {formatFileSize(maxSize)} per file.
          </p>
          <PrimaryButton
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              inputRef.current?.click()
            }}
            disabled={isUploading}
          >
            <IconUpload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Select Files"}
          </PrimaryButton>
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleInputChange}
        disabled={isUploading}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {files.length} file{files.length > 1 ? "s" : ""}
            </span>
            {files.some((f) => f.status === "complete") && (
              <button
                onClick={clearCompleted}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                file.error
                  ? "border-red-500/30 bg-red-500/5"
                  : file.status === "complete"
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border/50 bg-card"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  file.error
                    ? "bg-red-500/10"
                    : file.status === "complete"
                      ? "bg-green-500/10"
                      : "bg-muted"
                )}
              >
                {file.status === "uploading" ? (
                  <IconLoader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <IconFile
                    className={cn(
                      "h-4 w-4",
                      file.error
                        ? "text-red-400"
                        : file.status === "complete"
                          ? "text-emerald-400"
                          : "text-muted-foreground"
                    )}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.error || formatFileSize(file.size)}
                </p>
                {file.status === "uploading" && (
                  <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="p-1 rounded hover:bg-accent transition-colors"
                disabled={file.status === "uploading"}
              >
                <IconX className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
